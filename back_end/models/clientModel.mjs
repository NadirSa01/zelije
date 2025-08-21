import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", ClientSchema);
export default Client;
