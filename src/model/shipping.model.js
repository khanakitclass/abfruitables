const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
    {
        order_id:{
            type: mongoose.Types.ObjectId,
            ref: "Order",
            required: true
        },
        carries:{
            type: String,
            required: true
        },
        current_place:{
            type: String,
            required: true
        }

    },
    {
        timestamps: true,
        versionKey:false
    }
)

const Shipping = mongoose.model("Shipping",shippingSchema);
module.exports = Shipping;