// server/routes/propertyRoutes.js

const express = require("express");
const router = express.Router();
const protect = require("../middleware/middleware");
const upload = require("../middleware/upload");
const Property = require("../models/propertyModel");
const User = require("../models/User");
const { createProperty, getProperties, getPropertyById, getMyProperties, updateAvailability } = require("../controllers/propertyController");

router.get("/", getProperties);
router.put("/:id/availability",protect,updateAvailability);
router.get("/my", protect, async (req, res) => {
    try {
        const properties = await Property.find({
            owner: req.user.id
        });

        res.json({
            success: true,
            properties
        });

    } catch (err) {
        console.log("MY PROPERTIES ERROR:", err); // 👈 IMPORTANT
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

router.get("/:id", getPropertyById);
router.put(
    "/request-verification",
    protect,
    async (req, res) => {

        const user = await User.findById(req.user.id);

        if (user.role !== "landlord") {
            return res.status(403).json({
                success: false,
                message: "Only landlords can request verification"
            });
        }

        user.verificationStatus = "pending";

        await user.save();

        res.json({
            success: true,
            message: "Verification request submitted"
        });
    }
);
router.post(
    "/",
    protect,
    (req, res, next) => {
        upload.fields([
            { name: "images", maxCount: 20 },
            { name: "videos", maxCount: 10 }
        ])(req, res, (err) => {

            if (err) {

                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message: "File is too large. Maximum allowed size is 50 MB."
                    });
                }

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            next();
        });
    },
    createProperty
);

console.log(getPropertyById);

module.exports = router;