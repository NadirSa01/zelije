import mongoose from "mongoose";

const ServiceModel = new mongoose.Schema(
  {
    name: {
      type: Map,
      of: String,
      required: true,
      validate: {
        validator: (v) => {
          if (!v) return false;
          const keys = Array.from(v.keys());
          const requiredKeys = ["en", "fr", "ar"];
          // Must contain exactly these three keys
          return (
            requiredKeys.every((k) => keys.includes(k)) &&
            keys.length === requiredKeys.length &&
            requiredKeys.every((k) => typeof v.get(k) === "string" && v.get(k).trim() !== "")
          );
        },
        message: "name must include non-empty translations for 'en', 'fr', 'ar'",
      },
    },
    description: {
      type: Map,
      of: String,
      required: true,
      validate: {
        validator: (v) => {
          if (!v) return false;
          const keys = Array.from(v.keys());
          const requiredKeys = ["en", "fr", "ar"];
          return (
            requiredKeys.every((k) => keys.includes(k)) &&
            keys.length === requiredKeys.length &&
            requiredKeys.every((k) => typeof v.get(k) === "string" && v.get(k).trim() !== "")
          );
        },
        message: "description must include non-empty translations for 'en', 'fr', 'ar'",
      },
    },
    highPrice: { type: Number, required: true },
    lowPrice: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", ServiceModel);
export default Service;
