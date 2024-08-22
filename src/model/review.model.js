const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        product_id:{
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true
        },
        user_id:{
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating:{
            type: Number,
            required: true
        },
        comment:{
            type: String
        }
    },
    {
        timestamps: true,
        versionKey:false
    }
)

const Review = mongoose.model("Review",reviewSchema);
module.exports = Review