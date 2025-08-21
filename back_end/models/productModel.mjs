import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: Map,
      of: String,
      required: true,
      validator: (v) => {
        if (!v) return false;
        const keys = Array.from(v.keys());
        const requiredKeys = ["en", "fr", "ar"];
        if (!requiredKeys.every((k) => keys.includes(k))) return false;
        if (keys.length !== requiredKeys.length) return false;
        for (const k of requiredKeys) {
          const val = v.get(k);
          if (typeof val !== "string" || val.trim() === "") return false;
        }
        return true;
      },
    },
    price: { type: Number, required: true },
    size: { type: String, required: true ,default: "1m x 1m"},
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
