import config from "config"
import express from "express"
import "./utils/dbConnect.js"
import userRouter from "./controllers/Users/index.js"


let app = express();

const PORT = config.get("PORT");

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Server started 👨‍💻 ")
})
app.use("/user", userRouter)
// Error handler.
app.use("/", (req, res, next) => {
    res.status(404).json({ msg: "Route is not found" })
})

app.listen(PORT, (req, res) => {
    console.log(`http://localhost:9000`);
})