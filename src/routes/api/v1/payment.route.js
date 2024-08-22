const express = require("express");
const { paymentControler } = require("../../../controler");


const app = express();
const router = express.Router();


router.get("/list-payment",
    paymentControler.listpayment
);

router.post("/add-payment",  
    paymentControler.addpayment
);

router.put("/update-payment/:payment_id",  
    paymentControler.updatepayment
);

router.delete("/delete-payment/:payment_id",
    paymentControler.deletepayment
);


module.exports = router;