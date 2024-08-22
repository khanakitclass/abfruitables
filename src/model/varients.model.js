const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
            trim:true,
            lowercase:true
        },
        value:{
            type: String,
            required: true,
            trim: true
        },
        stock:{
            type: Number,
            required: true,  
        },
        price:{
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey:false
    }
)

const varientsSchema = new mongoose.Schema(
    {
        products_id:{
            type:mongoose.Types.ObjectId,
            ref:"Products",
            required:true
        },
        attribute:[attributeSchema]

    },
    {
        timestamps: true,
        versionKey:false
    }
)

const Varients =  mongoose.model("Varients",varientsSchema);
module.exports = Varients;