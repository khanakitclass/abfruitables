const express = require("express");
const { cartControler } = require("../../../controler");
const app = express();
const router = express.Router();


router.get("/list-cart",
    cartControler.listcart  
);
router.get("/list-cart/:cart_id",
    cartControler.getcart
);
router.post("/add-cart",
cartControler.addcart
);

router.put("/update-cart/:cart_id",
cartControler.updatecart 
);

router.delete("/delete-cart/:cart_id",
    cartControler.deletecart
);





module.exports = router;