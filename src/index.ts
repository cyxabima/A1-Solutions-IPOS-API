import express, { Request, Response } from "express";
import customerRouter from "./routes/customers.routes";
import userRouter from "./routes/users.routes"
import { errorHandler } from "./middlewares/error.middleware";
import shopRouter from "./routes/shops.routes";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json()); // Parse incoming JSON requests and make the data available in req.body

app.use("/api/v1/customers", customerRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/shops", shopRouter)



// error handling middleware
app.use(errorHandler);


app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
});
