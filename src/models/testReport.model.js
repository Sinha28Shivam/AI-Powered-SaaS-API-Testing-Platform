import mongoose from "mongoose";

const testReportSchema = new mongoose.Schema({
    apiId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'API'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    responseTime: {
        type: Number, // Execution time in milliseconds
        required: true
    },
    status: {
        type: Number, // HTTP status code
        required: true
    },
    responseData: {
        type: mongoose.Schema.Types.Mixed, // The JSON/text payload returned
    },
    success: {
        type: Boolean, // True if status is 2xx
        required: true
    },
    aiInsights: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.model('TestReport', testReportSchema);
