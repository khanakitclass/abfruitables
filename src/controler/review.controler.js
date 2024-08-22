const Review = require("../model/review.model");

const listreview = async(req,res) => {
    try {
        const review = await Review.find();
        if(!review || review.length === 0){
             res.status(404).json({
                message: "No review found",
                success: false,
            })
        }

        res.status(200).json({
            message: "review fetched successfully",
            success: true,
            data: review,
        })


    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching review" + error.message,
            success: false        
        })
    }
}

const getreview = async(req,res) => {
    try {
        const review = await Review.findById(req.params.review_id);
        if(!review){
            res.status(404).json({
                message: "review not found",
                success: false,
                })
                }
                res.status(200).json({
                    message: "review fetched successfully",
                    success: true,
                    data: review,
                    })

    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching review" + error.message,
            success: false        
        })
    }
}


const addreview = async (req, res) => {
    try {
    console.log(req.body);
   const review = await Review.create(req.body);

        if (!review) {
            return res.status(400).json({
                message: "Name and description are required",
                success: false,
            });
        }

        return res.status(201).json({
            message: "review added successfully",
            success: true,
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while adding review: " + error.message,
            success: false,
        });
    }
};

const updatereview = async (req, res) => {
    try {
        console.log(req.body);
        const review_id = (req.params.review_id)
        const review = await Review.findByIdAndUpdate(review_id,req.body,{new:true,runValidators:true});
        console.log(review);

        if (!review) {
            return res.status(400).json({
                message: "review not update",
                success: false,
                });
            };

          res.status(200).json({
            message: "review updated successfully",
            success: true,
            data: review,
          })  

    } catch (error) {
            return res.status(500).json({
                message: "Error occurred while updating review: " + error.message,
                success: false,
                });
            };
};


const deletereview = async (req, res) => {
    try {
       
        const review = await Review.findByIdAndDelete(req.params.review_id);

        if (!review) {
            return res.status(404).json({
                message: "review not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "review deleted successfully",
            success: true,
            data:review
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while deleting review: " + error.message,
            success: false,
            data:category,
        });
    }
};

module.exports = {
    listreview,
    getreview,
    addreview,
    updatereview,
    deletereview,
   
}