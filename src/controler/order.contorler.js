const Order = require("../model/order.model");
const Users = require("../model/users.model");
const { sendWelcomeEmail } = require("../utils/nodeemailer");
const  generateOrderPDF  = require('../utils/pdfmake');


const listorder = async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: "No order found",
                success: false,
            });
        }
        res.status(200).json({
            message: "Order fetched successfully",
            success: true,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching orders: " + error.message,
            success: false
        });
    }
};

const getorder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.order_id);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }
        res.status(200).json({
            message: "Order fetched successfully",
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching order: " + error.message,
            success: false
        });
    }
};

const addorder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        if (!order) {
            return res.status(400).json({
                message: "Name and description are required",
                success: false,
            });
        }

        generateOrderPDF(order, async (err, pdfPath) => {
            if (err) {
                return res.status(500).json({
                    message: "Error occurred while generating PDF: " + err.message,
                    success: false,
                });
            }

            const userData = await Users.findById(order.user_id).select("-password");
            if (!userData) {
                return res.status(404).json({
                    message: "User not found",
                    success: false,
                });
            }

          
            try {
                const emailContent = `Dear ${userData.name},\n\nYour order has been placed successfully. Please find the details below:\n\nOrder ID: ${order._id}\nTotal Amount: ${order.amount}\n\nThank you for shopping with us!\n\nBest regards,\nYour Company`;
                await sendWelcomeEmail(userData.email, 'Order Confirmation', emailContent, pdfPath);
            } catch (emailError) {
                console.error("Error sending order confirmation email:", emailError);
            }

            return res.status(201).json({
                message: "Order added successfully and PDF generated",
                success: true,
                data: order,
                pdfPath: pdfPath 
            });
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while adding order: " + error.message,
            success: false,
        });
    }
};



const updateorder = async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const order = await Order.findByIdAndUpdate(orderId, req.body, { new: true, runValidators: true });
        if (!order) {
            return res.status(400).json({
                message: "Order not updated",
                success: false,
            });
        }
        res.status(200).json({
            message: "Order updated successfully",
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while updating order: " + error.message,
            success: false,
        });
    }
};

const deleteorder = async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Order deleted successfully",
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while deleting order: " + error.message,
            success: false,
        });
    }
};

module.exports = {
    listorder,
    getorder,
    addorder,
    updateorder,
    deleteorder,
};
