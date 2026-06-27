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
                
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(
                        `Image "${file.originalname}" exceeds the 5 MB limit.`
                    );
                }

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
                if (file.size > 50 * 1024 * 1024) {
                    throw new Error(
                        `Video "${file.originalname}" exceeds the 50 MB limit.`
                    );
                }
        
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
        const limit = 10;

        const {
            search,
            sort,
            minPrice,
            maxPrice,
            location,
            propertyType
        } = req.query;

        let filter = {
            availability: true
        };

        if (propertyType) {

            filter.property_type = propertyType;
        
        }

        if (search) {
            filter.$or = [
                {
                    property_name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    location: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];        
        }

        if (location) {

            filter.location = {
                $regex: location,
                $options: "i"
            };
        
        }
        
        if (minPrice || maxPrice) {

            filter.price = {};
        
            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }
        
            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        
        }

        let sortOption = {
            createdAt: -1
        };
        
        if (sort === "oldest") {
            sortOption = {
                createdAt: 1
            };
        }
        
        if (sort === "priceLow") {
            sortOption = {
                price: 1
            };
        }
        
        if (sort === "priceHigh") {
            sortOption = {
                price: -1
            };
        }

        const skip = (page - 1) * limit;

        const properties = await Property.find(filter)
        .populate("owner", "fullname verificationStatus")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

        const total = await Property.countDocuments(filter);

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