import config from "config"
import express from "express"
import "./utils/dbConnect.js"
import userRouter from "./controllers/Users/index.js"
import authmiddleware from "./middleware/authmiddleware.js"
import publicRouter from "./controllers/root.js"


let app = express();

const PORT = config.get("PORT");

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Server started 👨‍💻 ")
})
app.use("/public",publicRouter)
app.use(authmiddleware)
app.use("/user", userRouter);
// Error handler.
app.use((req, res, next) => {
    res.status(404).json({ msg: "Route is not found" })
})

app.listen(PORT, (req, res) => {
    console.log(`http://localhost:9000`);
})