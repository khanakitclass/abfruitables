const express = require("express");
const { salsepersonControler } = require("../../../controler");


const app = express();
const router = express.Router();

router.get("/list-salseperson",
    salsepersonControler.listsalseperson
);

router.post("/add-salseperson",
    salsepersonControler.addSalsePersonsSql
)
router.delete("/delete-salseperson/:snum_id",
    salsepersonControler.deleteSalseperson
)

router.put("/update-salseperson/:snum_id",
    salsepersonControler.updateSalseperson
)

module.exports = router;