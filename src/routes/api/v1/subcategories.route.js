const express = require("express");
const { subcategoriesControler } = require("../../../controler");

const app = express();
const router = express.Router();

router.get("/list-subcategories", 
    subcategoriesControler.listSubcategories
);

router.post("/add-subcategories",
    subcategoriesControler.addSubcategories
);

router.put("/update-subcategories/:subcategories_id",
    subcategoriesControler.updateSubcategories
);

router.delete("/delete-subcategories/:subcategories_id",
    subcategoriesControler.deleteSubcategories
);

router.get("/filter-subcategories/:category_id",
    subcategoriesControler.filterCategory
);

router.get("/count-active",
    subcategoriesControler.isactive
)

router.get("/count-inactive",
    subcategoriesControler.inactive
)

module.exports = router;