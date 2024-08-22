const express = require("express");
const { productsControler } = require("../../../controler");
const upload = require("../../../middleware/upload");
const auth = require("../../../middleware/auth");
const multer = require("multer");

const app = express();
const router = express.Router();

router.get("/list-products",
    auth(["admin", "emploey"]),
    productsControler.listproducts
);

router.post("/add-products",
    upload.single("image"),
    productsControler.addproducts
);

router.put("/update-products/:products_id",
    upload.single("image"),
    productsControler.updateproducts
);

router.delete("/delete-products/:products_id",
    productsControler.deleteproducts
);

router.get("/search",
    productsControler.searchProduct
)


module.exports = router;