import mongoose from "mongoose";

const apiSchema = new mongoose.Schema({
    userId:{
        type:  mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: String,
    url: String,
    method: String,
    headers: Object,
    body: Object
});

export default mongoose.model('API', apiSchema);