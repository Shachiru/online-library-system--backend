import mongoose, { Schema } from "mongoose";

const BlacklistSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const Blacklist = mongoose.model("Blacklist", BlacklistSchema);

export default Blacklist;