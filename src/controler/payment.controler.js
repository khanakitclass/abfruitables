const Payment = require("../model/payment.model");

const listpayment = async(req,res) => {
    try {
        const payment = await Payment.find();
        if(!payment || payment.length === 0){
             res.status(404).json({
                message: "No payment found",
                success: false,
            })
        }

        res.status(200).json({
            message: "payment fetched successfully",
            success: true,
            data: payment,
        })


    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching payment" + error.message,
            success: false        
        })
    }
}

const getpayment = async(req,res) => {
    try {
        const payment = await Payment.findById(req.params.review_id);
        if(!payment){
            res.status(404).json({
                message: "payment not found",
                success: false,
                })
                }
                res.status(200).json({
                    message: "payment fetched successfully",
                    success: true,
                    data: payment,
                    })

    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching payment" + error.message,
            success: false        
        })
    }
}


const addpayment = async (req, res) => {
    try {
    console.log(req.body);
   const payment = await Payment.create(req.body);

        if (!payment) {
            return res.status(400).json({
                message: "Name and description are required",
                success: false,
            });
        }

        return res.status(201).json({
            message: "payment added successfully",
            success: true,
            data: payment,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while adding payment: " + error.message,
            success: false,
        });
    }
};

const updatepayment = async (req, res) => {
    try {
        console.log(req.body);
        const payment_id = (req.params.payment_id)
        const payment = await Payment.findByIdAndUpdate(payment_id,req.body,{new:true,runValidators:true});
        console.log(payment);

        if (!payment) {
            return res.status(400).json({
                message: "payment not update",
                success: false,
                });
            };

          res.status(200).json({
            message: "payment updated successfully",
            success: true,
            data: payment,
          })  

    } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating payment: " + error.message,
                success: false,
                });
            };
};


const deletepayment = async (req, res) => {
    try {
       
        const payment = await Payment.findByIdAndDelete(req.params.payment_id);

        if (!payment) {
            return res.status(404).json({
                message: "payment not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "payment deleted successfully",
            success: true,
            data:payment
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while deleting payment: " + error.message,
            success: false,
            data:category,
        });
    }
};

module.exports = {
    listpayment,
    getpayment,
    addpayment,
    updatepayment,
    deletepayment,
   
}