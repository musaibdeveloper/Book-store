import express from "express";

import userModel from "../../models/user/user.js"


const router = express.Router();

// Get-All

router.get("/getall", async (req, res) => {

    try {
        let UserAllData = await userModel.find({});
        res.status(200).json(UserAllData)

    } catch (error) {
        res.status(500).json({ msg: "Internal Server error" })
    }
});


// Get by ID

router.get("/get/:ID", async (req, res) => {
    try {
        let id = req.params.ID;
        let userData = await userModel.findById(id);
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update by ID
router.put("/update/:ID", async (req, res) => {
    try {
        let id = req.params.ID;
        let userData = req.body;
        await userModel.findByIdAndUpdate(
            {
                _id: id,
            },
            {
                $set: userData,
            },
            {
                new: true,
            }
        );
        res.status(200).json({ msg: "User data is Updated." });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete("/deleteall", async (req, res) => {
    try {
        let userDataErase = await userModel.deleteMany({});
        res.status(200).json({ msg: "All users data is deleted!!" })
    } catch (error) {
        res.status(500).json({ msg: "Internal Server error" })
    }
})


router.delete("/delete/:id", async (req, res) => {
    try {

        let deleteUserData = req.params.id;
        console.log(deleteUserData);
        await userModel.findByIdAndDelete(deleteUserData);
        res.status(200).json({ msg: "User deleted successfully" })

    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})



export default router;