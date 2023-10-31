import express from "express";
import bcrypt from "bcrypt"; 
import jwt from  "jsonwebtoken"
import randomString from "../../utils/random.js"
import config from "config"

import userModel from "../../models/user/user.js"
import { userRegisterValidations, errorMiddelware } from "../../middleware/index.js"

const router = express.Router();

router.post("/register", userRegisterValidations(), errorMiddelware, async (req, res) => {
    try {
        let userData = new userModel(req.body);
        
        //checking
        let emailCheck = await userModel.findOne({ email: userData.email })
        let phoneCheck = await userModel.findOne({ phone: userData.phone });
        
        if (emailCheck || phoneCheck) {
            res.status(200).json({ msg: "email and phone already exist" });
        }

        //hashing
        let hashing = await bcrypt.hash(userData.password, 10);
        userData.password = hashing;

        //random string 
        userData.userverifytoken.email = randomString(10)
        userData.userverifytoken.phone = randomString(10)

        //user authentication=
        let emailToken = jwt.sign(
            { email: userData.userverifytoken.email },
            config.get("JWTKEY"),
            { expiresIn: "60000" }
        );
        let phoneToken = jwt.sign(
            { phone: userData.userverifytoken.phone },
            config.get("JWTKEY"),
            { expiresIn: "60000" }
        );

        console.log(`${config.get("URL")}/user/email/verify/${emailToken}`);
        console.log(`${config.get("URL")}/user/phone/verify/${phoneToken}`);


        // console.log(emailToken);
        // console.log(phoneToken);
        console.log(userData);
        await userData.save()
        res.status(200).json({ msg: "User added successfully" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" })
    }
});

router.get("/email/verify/:token", async (req, res) => {
    try {
        let token = req.params.token;
        let verify = jwt.verify(token, config.get("JWTKEY"));

        if (!verify) {
            return res
                .status(401)
                .json({ sucess: false, msg: "Token Expire , Register Again" });
        }
        let userData = await userModel.findOne({
            "userverifytoken.email": verify.email,
        });
        if (!userData) {
            return res
                .status(200)
                .json({ success: "The Email has been Verified Already." });
        }
        // console.log(userData);
        userData.userverified.email = true;

        await userData.save();
        res.status(200).json({ success: "The Email has been Verified." });
    } catch (error) {
        console.log(error);

        res.status(500).json({ sucess: false, msg: "Internel Server Error" });
    }
});

router.get("/phone/verify/:token", async (req, res) => {
    try {
        let token = req.params.token;
        let verify = jwt.verify(token, config.get("JWTKEY"));
        // console.log(verify);

        if (!verify) {
            return res
                .status(401)
                .json({ sucess: false, msg: "Token Expire , Register Again" });
        }

        let userData = await userModel.findOne({
            "userverifytoken.phone": verify.phone,
        });
        // console.log(userData);

        if (!userData) {
            return res
                .status(200)
                .json({ success: "The Phone has been Verified Already." });
        }

        userData.userverified.phone = true;
        await userData.save();
        res.status(200).json({ success: "The Phone has been Verified." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, msg: "Internel Server Error" });
    }
});


export default router;