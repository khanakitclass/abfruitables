const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        await mongoose.connect("mongodb+srv://anikvohra3:123@cluster0.heqw9xn.mongodb.net/ecommerce")
        .then(()=> console.log("connected to mongodb"))
        .catch((error)=>{
            console.log("error", error);
    });
    
} catch (error) {
    // console.log("error", error);
    console.log(error);
    
    }
}

module.exports = connectdb;