import mongoose from "mongoose";

const ServiceOrderModel = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    description: { type: String }, 
    state: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    price:{
      type:Number,
      required:false,
      default:0
      }
  },
  { timestamps: true }
);

const ServiceOrder = mongoose.model("ServiceOrder", ServiceOrderModel);
export default ServiceOrder;
