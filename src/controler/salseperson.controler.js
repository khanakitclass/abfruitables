const { salsepersonModel } = require("../model");


const listsalseperson = async (req, res) => {
    try {
        const salsepersons = await salsepersonModel.getAllSalsePersons();
        return res.status(200).json({
            message: "salsepeople data fetched successfull ",
            success: true,
            data:salsepersons
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

const addSalsePersonsSql = async (req, res) => {
    try {
        const { sname, city, comm } = req.body;
        const salseperson = await salsepersonModel.addSalsePersons(sname, city, comm);
        console.log(salseperson);
        return res.status(201).json({
            message: "Salseperson added successfully",
            success: true,
            data: salseperson,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

const deleteSalseperson = async (req, res) => {
    try {
        const { snum_id } = req.params;
        console.log(snum_id);
        await salsepersonModel.deleteSalsePersonById(snum_id);
        return res.status(200).json({
            message: "Salseperson deleted successfully",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

const updateSalseperson = async (req,res) => {
    try {
        const { snum_id } = req.params;
        const { sname, city, comm } = req.body;
        const updatedSalseperson = await salsepersonModel.updateSalsePerson(snum_id, sname, city, comm);
        return res.status(200).json({
            message: "Salseperson updated successfully",
            success: true,
            data: updatedSalseperson,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}
module.exports = {
    listsalseperson,
    addSalsePersonsSql,
    deleteSalseperson,
    updateSalseperson
};
