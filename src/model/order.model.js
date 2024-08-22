const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        seller_id: {
            type: mongoose.Types.ObjectId,
            ref: "Seller",
            required: true
        },
        shipping_id: {
            type: mongoose.Types.ObjectId,
            ref: "Shipping",
            required: true
        },
        products: [
            {
                product_id: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        payment_id: {
            type: mongoose.Types.ObjectId,
            ref: "Payment",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
