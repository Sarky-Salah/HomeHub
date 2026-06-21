// server/routes/AdminRoutes.js

const express = require("express");
const router = express.Router();

const protect = require("../middleware/middleware"); // your JWT auth
const isAdmin = require("../middleware/AdminMiddleware");

const Property = require("../models/propertyModel"); // IMPORTANT
const { getAllUsers, getAllProperties } = require("../controllers/AdminController");

// GET USERS
router.get("/users", protect, isAdmin, getAllUsers);

// GET PROPERTIES
router.get("/properties", protect, isAdmin, getAllProperties);

// UPDATE PROPERTY (ADMIN EDIT)
router.put("/properties/:id", protect, isAdmin, async (req, res) => {
    try {
        const updated = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({ success: true, property: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE PROPERTY
router.delete("/properties/:id", protect, isAdmin, async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put(
    "/properties/:id/availability",
    protect,
    async (req, res) => {
      try {
        const property = await Property.findById(req.params.id);
  
        if (!property) {
          return res.status(404).json({
            success: false,
            message: "Property not found"
          });
        }
  
        // IMPORTANT: ensure req.user exists from protect middleware
        if (
          property.owner.toString() !== req.user.id &&
          req.user.role !== "admin"
        ) {
          return res.status(403).json({
            success: false,
            message: "Unauthorized"
          });
        }
  
        property.availability = req.body.availability;
  
        await property.save();
  
        res.json({
          success: true,
          property
        });
  
      } catch (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      }
    }
);

router.put(
  "/verify-user/:id",
  protect,
  async (req, res) => {

      const user = await User.findById(req.params.id);

      user.verificationStatus = "verified";
      user.verifiedAt = new Date();

      await user.save();

      res.json({
          success: true
      });
  }
);

  module.exports = router;