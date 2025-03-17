import express, { Request, Response } from "express";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json()); // Parse incoming JSON requests and make the data available in req.body


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        "message": "WELCOME TO A1 Solution"
    })
})
app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
});
