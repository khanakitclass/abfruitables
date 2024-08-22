const Varients = require("../model/variant.model");
const uploadFile = require("../utils/cloudinary");

const listVarients = async (req, res) => {
    try {

        const varients = await Varients.find();

        if (!varients || varients.length === 0) {
            return res.status(404).json({
                message: "No varients found",
                success: false,
            });
        }
        res.status(200).json({
            message: "varients fetched successfully",
            success: true,
            data: varients,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching varients: " + error.message,
            success: false
        });
    }
};

const getVarients = async (req, res) => {

    try {
        const varients = await Varients.findById(req.params.varients_id);
        console.log(varients);

        if (!varients) {
            return res.status(404).json({
                message: "varients not found",
                success: false,
            });
        }
        res.status(200).json({
            message: "varients fetched successfully",
            success: true,
            data: varients,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching varients: " + error.message,
            success: false
        });
    }
};

const addVarients = async (req, res) => {
    console.log("aaaaaa", req.body);
    console.log("bbbbb", req.files);
    try {
        const filesRes = await Promise.all(req.files.map(v => uploadFile(v.path, "images")));
        console.log(filesRes);
        const images = filesRes.map(v => ({
            url: v.url, 
            public_id: v.public_id
        }));

        const varients = await Varients.create({
            ...req.body,
            images
        });

        if (!varients) {
            return res.status(400).json({
                message: "Product ID, Category ID, Subcategory ID, and attributes are required",
                success: false,
            });
        }

        return res.status(201).json({
            message: "Variants added successfully",
            success: true,
            data: varients,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while adding variants: " + error.message,
            success: false,
        });
    }
};

const updateVarients = async (req, res) => {
    try {
        const varients_id = req.params.varients_id;
        let dataNew = req.body;

        if (req.files && req.files.length > 0) {
            const filesRes = await Promise.all(req.files.map(file => uploadFile(file.path, "images")));

            const images = filesRes.map(fileRes => ({
                url: fileRes.url,
                public_id: fileRes.public_id
            }));

            dataNew = {
                ...req.body,
                images
            };
        }

        const updatedVarients = await Varients.findByIdAndUpdate(varients_id, dataNew, { new: true, runValidators: true });

        if (!updatedVarients) {
            return res.status(404).json({
                message: "Variant not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Variant updated successfully",
            success: true,
            data: updatedVarients,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while updating variant: " + error.message,
            success: false,
        });
    }
};

module.exports = { updateVarients };

const deleteVarients = async (req, res) => {
    try {
        const varients_id = req.params.varients_id;

        const variant = await Varients.findByIdAndDelete(varients_id);


        if (!variant) {
            return res.status(404).json({
                message: "variant not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "variant deleted successfully",
            success: true,
            data: variant,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while deleting variant: " + error.message,
            success: false,
        });
    }
};





module.exports = {
    listVarients,
    getVarients,
    addVarients,
    updateVarients,
    deleteVarients
};
