import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

// Debug check
console.log("MONGODB_URI from env:", process.env.MONGODB_URI);

await connectDB();

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(PORT, () => console.log("🚀 Server running on port " + PORT));
