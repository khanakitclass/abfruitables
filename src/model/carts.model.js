const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        products_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity:{
            type: Number,
            required: true,
            default:1
            },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const cartsSchema = new mongoose.Schema(
    {
        users_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items:[itemSchema],

    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Carts = mongoose.model("Carts",cartsSchema);
module.exports = Carts;