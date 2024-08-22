const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
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
        review:{
            type: String
        }
    },
    {
        timestamps: true,
        versionKey:false
    }
)

const Rating = mongoose.model("Rating",ratingSchema);
module.exports = Rating