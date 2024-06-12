import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  courier: {
    type: mongoose.ObjectId,
    ref: "users",
  },
  orderId: {
    type: mongoose.ObjectId,
    ref: "orders",
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
},
{ timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);