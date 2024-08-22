const express = require("express");
const { orderControler } = require("../../../controler");


const app = express();
const router = express.Router();

router.get("/list-order",
    orderControler.listorder
);

router.post("/add-order",  
    orderControler.addorder
);

router.put("/update-order/:order_id",  
    orderControler.updateorder
);

router.delete("/delete-order/:order_id",
    orderControler.deleteorder
);


module.exports = router;