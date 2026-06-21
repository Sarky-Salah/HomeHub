// server/routes/propertyRoutes.js

const express = require("express");
const router = express.Router();
const protect = require("../middleware/middleware");
const upload = require("../middleware/upload");

const { createProperty, getProperties, getPropertyById, getMyProperties, updateAvailability } = require("../controllers/propertyController");

router.get("/", getProperties);
router.get("/my-properties", protect, getMyProperties);
router.get("/:id", getPropertyById);
router.get("/my", protect, getMyProperties);
router.put("/:id/availability",protect,updateAvailability);
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
    upload.fields([
        { name: "images", maxCount: 20 },
        { name: "videos", maxCount: 10 }
    ]),
    createProperty
);

console.log(getPropertyById);

module.exports = router;