import mongoose from "mongoose";
const schema = mongoose.Schema;

const msgSchema = new schema({
    message: {
        type: String,
    },
    extra: {
        type: String,
    },
    userID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    room : {
        type: String
    },
    isBot: {
        type: Boolean,
        default: false
    }
},{timestamps: true, versionKey: false})

export default mongoose.model('Message',msgSchema);