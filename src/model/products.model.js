const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
    {
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categories",
            required: true,
        },
        subcategory_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategories",
            required: true,
        },

        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        image: {
            type: {
                public_id: String,
                url: String
            }
        },
        // image:{
        //     type:String
        // },

        price: {
            type: Number,
            required: true,
        },
        is_active: {
            type: Boolean,
            default: true
        },

    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Products = mongoose.model("Products", productsSchema);
module.exports = Products;