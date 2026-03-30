import mongoose from "mongoose";

const apiSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    url: String,
    method: String,
    headers: Object,
    body: Object
});

export default mongoose.model('api', apiSchema);