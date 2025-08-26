import mongoose from "mongoose";

const OrderLineSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productDetailId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductDetail", required: true },
    quantity: { type: Number, required: true },
    price: { type: mongoose.Schema.Types.Decimal128 , required: true }
  },
  { timestamps: true }
);

const OrderLine = mongoose.model("OrderLine", OrderLineSchema);
export default OrderLine;
