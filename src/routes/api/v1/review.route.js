const express = require("express");
const { reviewControler } = require("../../../controler");

const app = express();
const router = express.Router();

router.get("/list-review",
    reviewControler.listreview
);

router.post("/add-review",  
    reviewControler.addreview
);

router.put("/update-review/:review_id", 
    reviewControler.updatereview
);

router.delete("/delete-review/:review_id",
    reviewControler.deletereview
);


module.exports = router;