const Categories = require("../model/categories.model");
const { param } = require("../routes/api/v1/categories.route");
const { sendOtp } = require("../utils/twilio");

const listcategories = async(req,res) => {
  // console.log("sdsds");
  
    try {  
      let page = parseInt(req.query.page);
      let pageSize = parseInt(req.query.pageSize);
        const categories = await Categories.find();
        console.log(categories,page,pageSize);
        
    
        
        
      if(page <=0 && pageSize<=0){
        return  res.status(404).json({
          message: "page size must be greater than zero",
          success: false,
      })
      }

      let startIndex=0,endIndex=0, paginatedData=[];

      if(page > 0 && pageSize >0) {
        startIndex = (page - 1) * pageSize;
        endIndex = startIndex + pageSize;
        paginatedData = categories.slice(startIndex,endIndex)
      }


      
        if(!categories || categories.length === 0){
            return res.status(404).json({
                message: "No categories found",
                success: false,
         
            })
        }
        if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
  
          return res.status(200).json({
              message: "Categories fetched successfully",
              success: true,
              data: categories,
          });
      }

       return res.status(200).json({
            message: "Categories fetched successfully",
            success: true,
            data: paginatedData ,
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while fetching products" + error.message,
            success: false        
        })
    }
}

const getcategories = async(req,res) => {
    try {
        const category = await Categories.findById(req.params.category_id);
        if(!category){
          return  res.status(404).json({
                message: "Category not found",
                success: false,
                })
                }
               return res.status(200).json({
                    message: "Category fetched successfully",
                    success: true,
                    data: category,
                    })


    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while fetching category" + error.message,
            success: false        
        })
    }
}


const addcategories = async (req, res) => {
    try {
   const category = await Categories.create(req.body);

        if (!category) {
            return res.status(400).json({
                message: "Name and description are required",
                success: false,
            });
        }

        return res.status(201).json({
            message: "Category added successfully",
            success: true,
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while adding category: " + error.message,
            success: false,
        });
    }
};

const updatecategories = async (req, res) => {
  console.log("Sds");
  
    try {
        console.log(req.body,"sd");
        const category_id = (req.params.category_id)
        const category = await Categories.findByIdAndUpdate(category_id,req.body,{new:true,runValidators:true});
        console.log(category);

        if (!category) {
            return res.status(400).json({
                message: "Category not update",
                success: false,
                });
            };

          res.status(200).json({
            message: "Category updated successfully",
            success: true,
            data: category,
          })  

    } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating category: " + error.message,
                success: false,
                });
            };
};


const deletecategories = async (req, res) => {
    try {
       
        const category = await Categories.findByIdAndDelete(req.params.category_id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Category deleted successfully",
            success: true,
            data:category
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while deleting category: " + error.message,
            success: false,
            data:category,
        });
    }
};

const isactive = async (req, res) => {
    try {
        console.log(req.params.category_id);

        const trueactive = await Categories.aggregate(
            [
                {
                  $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "category_id",
                    as: "products"
                  }
                },
                 {
                   $unwind: {
                     path: "$products",
                   }
                 },
                 {
                   $group: {
                     _id: "$_id",
                      Highest_number_products: {
                       $sum: 1
                     }
                   }
                 },
                 {
                   $sort: {
                   Highest_number_products: -1
                 }
                 },
                 {
                   $limit: 1
                 }
               ]

        )
        if (!trueactive) {
            res.status(404).json({
                message: "No categories found",
                success: false
            });
        }
        res.status(200).json({
            message: "Category active successfully",
            success: true,
            data: trueactive
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server" + error.message,
            success: false,
            data: trueactive
        });
    }
}

const mostproducts = async (req, res) => {
    try {
        const highestNoproduct = await Categories.aggregate(
            [
                {
                  $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "category_id",
                    as: "products"
                  }
                },
                 {
                   $unwind: {
                     path: "$products",
                   }
                 },
                 {
                   $group: {
                     _id: "$_id",
                      Highest_number_products: {
                       $sum: 1
                     }
                   }
                 },
                 {
                   $sort: {
                   Highest_number_products: -1
                 }
                 },
                 {
                   $limit: 1
                 }
               ]
        );
        console.log(highestNoproduct);
    
        if(!highestNoproduct){
            res.status(404).json({
                message: "No category data found",
                success: false,  
            })
        }
    
        res.status(200).json({
            message: "count Active Category get",
            success: true,
            data: highestNoproduct,
        })
    
       } catch (error) {
        res.status(500).json({
            message: 'internal server Error' + error.message,
            success: false
        })
       }
 }

 const avjProducts =  async (req, res) => {
    try {
        const highestNoproduct = await Categories.aggregate(
            [
                {
                  $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "category_id",
                    as: "products"
                  }
                },
                 {
                   $unwind: {
                     path: "$products",
                   }
                 }
                 ,
                 {
                   $group: {
                     _id: "$_id",
                     categroy_id : {$first : "$_id"},
                      average_number_of_products_per_category: {
                       $sum: 1
                     }
                   }
                 }
               ]
        );
        console.log(highestNoproduct);
    
        if(!highestNoproduct){
            res.status(404).json({
                message: "No category data found",
                success: false,  
            })
        }
    
        res.status(200).json({
            message: "count Active Category get",
            success: true,
            data: highestNoproduct,
        })
    
       } catch (error) {
        res.status(500).json({
            message: 'internal server Error' + error.message,
            success: false
        })
       }
 }

 const inactive = async (req, res) => {
    try {
        const InactiveCategory = await Categories.aggregate(
            [
                {
                  $match: {
                    is_active : false
                  }
                },
                {
                  $count: 'Total no of inActive Catetogry'
                }
              ]
        );
        console.log(InactiveCategory);
    
        if(!InactiveCategory){
            res.status(404).json({
                message: "No category data found",
                success: false,  
            })
        }
    
        res.status(200).json({
            message: "count InActive Category get",
            success: true,
            data: InactiveCategory,
        })
    
       } catch (error) {
        res.status(500).json({
            message: 'internal server Error' + error.message,
            success: false
        })
       }
 }

module.exports = {
    listcategories,
    getcategories,
    addcategories,
    updatecategories,
    deletecategories,
    isactive,
    mostproducts,
    avjProducts,
    inactive
}