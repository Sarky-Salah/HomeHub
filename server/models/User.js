// server/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    fullname: {
        type: String,
        required: true
    },
    
    phoneNumber: {
        type: String,
        required: true,
        unique:true
    },

    role: {
        type: String,
        enum: ["tenant", "landlord", "admin"],
        default: "tenant"
    },

    country: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },    
    verificationStatus: {
        type: String,
        enum: ["unverified", "pending", "verified", "rejected"],
        default: "unverified"
    },
    verifiedAt: {
        type: Date
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);