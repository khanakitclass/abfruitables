const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
    { 
        name:{
            type: String,
            required: true,
            unique: true,
            trim:true,
            lowercase:true
        },
        description:{
            type: String,
            required: true,
            trim:true,
            lowercase:true
        },
        image:{
            type: String,
            // required: true,
        },
        is_active:{
            type:Boolean,
        }

    },
    {
        timestamps: true,
        versionKey:false
    }
);

const Categories = mongoose.model("Categories",categoriesSchema);
module.exports = Categories;