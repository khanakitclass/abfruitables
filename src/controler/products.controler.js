const Products = require("../model/products.model");
const uploadFile = require("../utils/cloudinary");

const listproducts = async (req, res) => {
    try {
        const products = await Products.find();

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found",
                success: false,
            });
        }
        res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching products: " + error.message,
            success: false
        });
    }
};

const addproducts = async (req, res) => {
    console.log("Adding a new product", req.file);
    try {
        // const fileRes = await uploadFile(req.file.path,"image")
        // console.log(fileRes);

        const products = await Products.create({...req.body,
            image:{
                url:req.file.path,
                public_id:''
            },

        });

        if (!products) {
            return res.status(400).json({
                message: "Failed to add the product",
                success: false,
            });
        }
        return res.status(201).json({
            message: "Product added successfully",
            success: true,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while adding product: " + error.message,
            success: false
        });
    }
};

const updateproducts = async (req, res) => {
   console.log(req.file.path,"path");
   
    try {
        const products_id = req.params.products_id;
       let dataNew = '';
    
       if(req.file){ 
        // const fileRes = await uploadFile(req.file.path,"pro_image") 
        dataNew = {...req.body,
            image:{
                url:req.file.path,
                public_id:"",
                },
       }
      
 

    } else {
        dataNew = req.body
    }
    // const productData = await Products.create({
    //   ...req.body,
    //   pro_image:req.file.path
    // })
    // console.log(productData);

        const products = await Products.findByIdAndUpdate(products_id,dataNew ,{ new: true, runValidators: true });

        if (!products) {
            return res.status(400).json({
                message: "Product not updated",
                success: false,
            });
        }
        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while updating product: " + error.message,
            success: false,
        });
    }
};

const deleteproducts = async (req, res) => {
    try {
        const products_id = req.params.products_id;
        console.log(products_id);

        const products = await Products.findByIdAndDelete(products_id);
        console.log(products);

        if (!products) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            success: true,
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while deleting product: " + error.message,
            success: false,
        });
    }
};

const searchProduct = async(req,res) => {
    try {
    
      const {sortOrder,category_id,rating,max,page,min,limit} = req.body
      console.log(category_id,rating,max,page,min,limit,sortOrder);

      let mergPipline = {
    
      };

      if(category_id){
        mergPipline["category_id"] = category_id
        }

      if(rating){
        mergPipline["avgrating"] = {$gte:rating};
      }  

      if(min != undefined || max != undefined){
        mergPipline["variant.attributes.Price"] = {};
      }

      if(min != undefined){
        mergPipline["variant.attributes.Price"]["$gte"] = max;
    }

    if(max != undefined){
        mergPipline["variant.attributes.Price"]["$lte"] = min;
    };



        console.log(mergPipline);
        
       const pipline = [
        {
          $lookup: {
            from: 'variants',
            localField: '_id',
            foreignField: 'product_id',
            as: 'variant'
          }
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'product_id',
            as: 'review'
          }
        },
        {
          $addFields: {
            avgrating:'$review.rating'
          }
        },
        {
          $unwind: {
            path: '$variant',
            
          }
        },
        {
          $match: mergPipline
        },
        {
          $group: {
            _id: '$_id',
            name:{$first:'$name'},
           variant:{$push:"$variant"},
            review:{$push:"$review"}
            }
        },
        {
          $sort: {
            name: sortOrder == "acs" ? 1 : -1
          }
        },
    
      ] 
      if(page >=1 && limit>=1){
        pipline.push({$skip:(page-1)*limit})
        pipline.push({$limit:limit})
     
      }

      const data = await Products.aggregate(pipline);
      console.log(data);
      
        res.status(200).json({
          success:true,
          data: data,
          message:"data search sucessFully"

        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
          success:false,
          message:"error in search"
          })
    }
}

module.exports = {
    listproducts,
    addproducts,
    updateproducts,
    deleteproducts,
    searchProduct
};


// [
//     {
//       $lookup: {
//         from: 'variants',
//         localField: '_id',
//         foreignField: 'product_id',
//         as: 'variant'
//       }
//     },
//     {
//       $lookup: {
//         from: 'reviews',
//         localField: '_id',
//         foreignField: 'product_id',
//         as: 'review'
//       }
//     },
//     {
//       $addFields: {
//         avgrating:'$review.rating'
//       }
//     },
//     {
//       $unwind: {
//         path: '$variant',
        
//       }
//     },
//     {
//       $match: {
//            avgrating:{$gte:4},
//         category_id:1,
//         'variant.attributes.Price':{$gte:0 , $lte:1000}
//       }
//     },
//     {
//       $group: {
//         _id: '$_id',
//         name:{$first:'$name'},
//        variant:{$push:"$variant"},
//         review:{$push:"$review"}
//         }
//     },
//     {
//       $sort: {
//         name:1
//       }
//     },
//     {
//       $skip: 0
//     },
//     {
//       $limit: 10
//     }
//   ]