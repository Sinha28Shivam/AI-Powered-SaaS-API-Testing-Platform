import api from "../models/api.model.js";

export const addApi = async (req, res) => {
    try{
        const { name, url, method, headers, body } = req.body;
        const api = await api.create({
            userId: req.user.id,
            name,
            url,
            method,
            headers,
            body
        });
        res.status(201).json(api);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getApis = async (req, res) => {
    const apis = await api.find({ userId: req.user.id });
    res.json(apis);
}