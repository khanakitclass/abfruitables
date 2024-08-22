const Carts = require("../model/carts.model");

const listcart = async(req,res) => {
    // console.log("get cart");
    try {
        const cart = await Carts.find();
        if(!cart || cart.length === 0){
             res.status(404).json({
                message: "No cart found",
                success: false,
            })
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            data: cart,
        })


    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching products" + error.message,
            success: false        
        })
    }
}

const getcart = async(req,res) => {
    try {
        const cart = await Carts.findById(req.params.category_id);
        if(!cart){
            res.status(404).json({
                message: "Cart not found",
                success: false,
                })
                }
                res.status(200).json({
                    message: "Cart fetched successfully",
                    success: true,
                    data: cart,
                    })

    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching cart" + error.message,
            success: false        
        })
    }
}


const addcart = async (req, res) => {
    try {
    console.log(req.body);
   const cart = await Carts.create(req.body);

        if (!cart) {
            return res.status(400).json({
                message: "Name and description are required",
                success: false,
            });
        }

        return res.status(201).json({
            message: "Cart added successfully",
            success: true,
            data: cart,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while adding cart: " + error.message,
            success: false,
        });
    }
};

const updatecart = async (req, res) => {
    try {
        console.log(req.body);
        const cart_id = (req.params.cart_id)
        const cart = await Carts.findByIdAndUpdate(cart_id,req.body,{new:true,runValidators:true});
        console.log(cart);

        if (!cart) {
            return res.status(400).json({
                message: "Cart not update",
                success: false,
                });
            };

          res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            data: cart,
          })  

    } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating cart: " + error.message,
                success: false,
                });
            };
};


const deletecart = async (req, res) => {
    try {
       
        const cart = await Carts.findByIdAndDelete(req.params.cart_id);

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Cart deleted successfully",
            success: true,
            data:cart
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while deleting cart: " + error.message,
            success: false,
        });
    }
};

module.exports = {
    listcart,
    getcart,
    addcart,
    updatecart,
    deletecart,
   
}