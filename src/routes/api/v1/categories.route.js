const express = require("express");
const { categoriesControler } = require("../../../controler");
const auth = require("../../../middleware/auth");
const { sendOtp, verifyOTP } = require("../../../utils/twilio");
const validate = require("../../../middleware/validate");
const { categoryValidation } = require("../../../validate");
const app = express();
const router = express.Router();


router.get("/list-categories",
    // sendOtp,
    auth(["admin", "emploey"]),
    categoriesControler.listcategories
);
router.get("/list-categories/:category_id",
    validate(categoryValidation.getCategory),
    verifyOTP,
    categoriesControler.getcategories
);
router.post("/add-categories",
    validate(categoryValidation.createCategory),
    categoriesControler.addcategories
);

router.put("/update-categories/:category_id",
    validate(categoryValidation.updateCategory),
    categoriesControler.updatecategories
);

router.delete("/delete-categories/:category_id",
    validate(categoryValidation.deleteCategory),
    categoriesControler.deletecategories
);

router.get("/active-categories",
    categoriesControler.isactive
);

router.get("/most-products",
    categoriesControler.mostproducts
)

router.get("/average-products",
    categoriesControler.avjProducts
)

router.get("/inactive",
    categoriesControler.inactive
)



module.exports = router;