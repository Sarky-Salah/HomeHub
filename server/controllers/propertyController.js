// server/controllers/propertyController.js

const Property = require("../models/propertyModel");
const uploadToSupabase = require("../utils/uploadToSupabase");

exports.createProperty = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        let uploadedImages = [];
        let uploadedVideos = [];

        // ✅ UPLOAD IMAGES
        if (req.files?.images) {
            for (const file of req.files.images) {
        
                const url = await uploadToSupabase(
                    file,
                    "property-images"
                );
        
                uploadedImages.push(url);
            }
        }
        

        // ✅ UPLOAD VIDEOS
        if (req.files?.videos) {
            for (const file of req.files.videos) {
        
                const url = await uploadToSupabase(
                    file,
                    "property-videos"
                );
        
                uploadedVideos.push(url);
            }
        }

        const property = await Property.create({
            ...req.body,
            images: uploadedImages,
            videos: uploadedVideos,
            owner: req.user.id
        });

        res.status(201).json({
            success: true,
            property
        });

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProperties = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 1;

        const skip = (page - 1) * limit;

        const properties = await Property.find({
            availability: true})
            .skip(skip)
            .limit(limit);

        const total = await Property.countDocuments();

        res.json({
            success: true,
            properties,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPropertyById = async (req, res) => {
    try {

        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        res.json({
            success: true,
            property
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMyProperties = async (req, res) => {
    try {

        const userId = req.user.id;

        const properties = await Property.find({            
            owner: req.user.id
        }).sort({ createdAt: -1 });

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

exports.toggleAvailability = async (req, res) => {
    const property = await Property.findById(req.params.id);

    if (!property) {
        return res.status(404).json({ success: false });
    }

    property.availability = !property.availability;
    await property.save();

    res.json({ success: true, property });
};

exports.updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        property.availability = req.body.availability;
        await property.save();

        res.json({
            success: true,
            property
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};