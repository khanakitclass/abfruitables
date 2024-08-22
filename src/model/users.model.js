const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
            trim:true,
            lowercase:true
        },
        // address:{
        //     type: String,
        // },
        email:{
            type: String,
            required: true,
            unique: true,
            trim:true,
            lowercase:true            
        },
        password:{
            type: String,
            trim:true,         
        },
        // mobile_number:{
        //     type: Number,
        //     unique: true
        // },
        googleId:{
            type:String
        },
        file:{
            type:String
        },
        role:{
            type: String,
            required: true,
        },
        avtar:{
            type: String,
          
        },
        refreshToken:{
            type: String,
            trim:true
        }
    },
    {
        timestamps: true,
        versionKey:false
    }
)


const Users = mongoose.model("Users",usersSchema);
module.exports = Users;