import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import AdminRouter from "./routes/adminRoutes.mjs";
import MessageRouter from "./routes/messageRoutes.mjs";
import ClientRouter from "./routes/clientRoutes.mjs";
import ProductRouter from "./routes/productRoutes.mjs";
import OrderRouter from "./routes/orderRoutes.mjs";
import ServiceRouter from "./routes/serviceRoutes.mjs";
import ServiceOrderRouter from "./routes/serviceOrderRoutes.mjs";
import chartRouter from "./routes/chartRoutes.mjs";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
const mongoUrl =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27011/dbZelij?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2";
const port = process.env.PORT || 3000;

const ConnectDb = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: "dbZelij",
    })
    .then(() => {
      console.log("MongoDB is connected  successfully ");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};
const StartServer = () => {
  try {
    ConnectDb();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

app.use("/api", AdminRouter);
app.use("/api", MessageRouter);
app.use("/api", ClientRouter);
app.use("/api", ProductRouter);
app.use("/api", OrderRouter);
app.use("/api", ServiceRouter);
app.use("/api", ServiceOrderRouter);
app.use("/api", chartRouter);
StartServer();
