import mongoose from "mongoose";
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
    },
    room: {
        type: String,
        default: null
    }
},{timestamps: true, versionKey: false})

export default mongoose.model('User',userSchema);