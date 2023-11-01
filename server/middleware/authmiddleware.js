import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import config from "config"

function authmiddleware(req, res, next) {
    try {

        let token = req.headers["access-token"]
        if (!token) {

            return res.status(404).json({ msg: "Please provide a token" })
        }

       
        let decrypt = CryptoJS.AES.decrypt(token, config.get("CRYPTO"));
        const originalText = decrypt.toString(CryptoJS.enc.Utf8);
     

        let verifyjwt = jwt.verify(originalText, config.get("JWTKEY"))

        if (!verifyjwt) {
            res.status(500).json({ msg: "Time out!" })
        }

        console.log(verifyjwt);

        next();


    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Token expired" })
    }
}

export default authmiddleware;