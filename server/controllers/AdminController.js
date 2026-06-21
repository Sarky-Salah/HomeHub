// server/controllers/AdminController.js

const User = require("../models/User");
const Property = require("../models/propertyModel");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.json({
            success: true,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find()
            .populate("owner", "fullname email");

        res.json({
            success: true,
            properties
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getCollections = async (req, res) => {
    try {
        const mongoose = require("mongoose");

        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();

        res.json({
            success: true,
            collections: collections.map(c => c.name)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};