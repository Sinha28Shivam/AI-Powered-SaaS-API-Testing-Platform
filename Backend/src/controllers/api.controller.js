import mongoose from "mongoose";
import API from "../models/api.model.js";
import TestReport from "../models/testReport.model.js";
import { enqueueTest } from "../queues/test.queue.js";
import { analyzeTestResult } from "../services/ai.service.js";
import { generateOpenApiSpec } from '../services/swagger.service.js';

export const addApi = async (req, res) => {
    try {
        const { name, url, method, headers, body } = req.body;
        const newApi = await API.create({
            userId: req.user.id,
            name,
            url,
            method,
            headers,
            body
        });
        res.status(201).json(newApi);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getApis = async (req, res, next) => {
    try {
        console.log("USER:", req.user);
        const apis = await API.find({
            userId: new mongoose.Types.ObjectId(req.user.id)
        });
        res.json(apis);
    } catch (err) {
        next(err);
    }
}

export const testApiEndpoint = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Find API
        const api = await API.findOne({ _id: id, userId: req.user.id });

        if (!api) {
            return res.status(404).json({ message: "API not found" });
        }

        // Hand off to bullmq
        const job = await enqueueTest(api._id, req.user.id);

        res.status(202).json({
            message: "Test has been queued! Your report is generating in the background.",
            jobId: job.id
        });
    } catch (err) {
        next(err);
    }
}

// Fetch all previously generated AI test reports for a specific API
export const getApiReports = async (req, res, next) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Ensure the API belongs to the user
        const api = await API.findOne({ _id: id, userId: req.user.id });
        if (!api) {
            return res.status(404).json({ message: "API not found" });
        }

        const totalReports = await TestReport.countDocuments({ apiId: id });
        
        const reports = await TestReport.find({ apiId: id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            reports,
            totalPages: Math.ceil(totalReports / limit) || 1,
            currentPage: page
        });
    } catch (err) {
        next(err);
    }
}

export const getApiDocs = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Ensure user owns API
        const api = await API.findOne({ _id: id, userId: req.user.id });
        if (!api) return res.status(404).json({ message: "API not found" });

        // Grab the MOST RECENT successful test report
        const report = await TestReport.findOne({ apiId: id, success: true }).sort({ createdAt: -1 });
        if (!report) return res.status(404).json({ message: "Run a successful AI test first to generate schemas." });

        // Map live response data to Swagger Schema
        const swaggerJson = generateOpenApiSpec(api, report);

        // Send back pure, valid JSON!
        res.json(swaggerJson);
    } catch (err) {
        next(err);
    }
};


export const deleteApi = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Delete the main API
        const api = await API.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!api) return res.status(404).json({ message: "API not found" });

        // 2. Cleanup: Cascade delete all associated test reports in the database
        await TestReport.deleteMany({ apiId: id });

        res.json({ message: "API target and all associated AI reports deleted successfully." });
    } catch (err) {
        next(err);
    }
};
