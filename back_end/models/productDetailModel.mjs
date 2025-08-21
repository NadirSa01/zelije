import mongoose from "mongoose";

const ProductDetailSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    colorName: {
      type: Map,
      of: String,
      required: true,
      validate: {
        validator: (v) => {
          if (!v) return false;
          const keys = Array.from(v.keys());
          const requiredKeys = ["en", "fr", "ar"];
          // Must contain exactly 'en', 'fr', 'ar' and no extra keys
          if (!requiredKeys.every((k) => keys.includes(k))) return false;
          if (keys.length !== requiredKeys.length) return false;
          // Also ensure no empty strings
          for (const k of requiredKeys) {
            const val = v.get(k);
            if (typeof val !== "string" || val.trim() === "") return false;
          }
          return true;
        },
        message:
          "colorName must include non-empty translations for 'en', 'fr', and 'ar'",
      },
    },
    colorCode: { type: String, required: true },
    quantity: { type: Number, required: true },
    picture: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductDetail = mongoose.model("ProductDetail", ProductDetailSchema);
export default ProductDetail;
