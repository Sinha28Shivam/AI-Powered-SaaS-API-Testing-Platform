import mongoose from "mongoose";
import API from "../models/api.model.js";
import TestReport from "../models/testReport.model.js";
import { enqueueTest } from "../queues/test.queue.js";
import { analyzeTestResult } from "../services/ai.service.js";

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

        // Ensure the API belongs to the user
        const api = await API.findOne({ _id: id, userId: req.user.id });
        if (!api) {
            return res.status(404).json({ message: "API not found" });
        }

        // Fetch all test reports sorted by the newest first
        const reports = await TestReport.find({ apiId: id })
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (err) {
        next(err);
    }
}
