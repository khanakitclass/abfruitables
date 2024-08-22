const express = require("express");
const router = express.Router();

const categoriesRouter  = require("./categories.route");
const subcategorisRouter = require("./subcategories.route");
const productsRouter = require("./products.route");
const varientsRouter = require("./varients.route");
const reviewRouter = require("./review.route");
const userRouter = require("./user.route");
const orderRouter = require("./order.route");
const paymentRouter = require("./payment.route");
const cartRouter = require("./cart.route");
const salsePersonRouter = require("./salseperson.route");


router.use("/categories",categoriesRouter);
router.use("/subcategories",subcategorisRouter);
router.use("/products",productsRouter);
router.use("/varients",varientsRouter);
router.use("/reviews",reviewRouter);
router.use("/users",userRouter);
router.use("/orders",orderRouter);
router.use("/payments",paymentRouter);
router.use("/carts",cartRouter);
router.use("/salseperson",salsePersonRouter);


module.exports = router;