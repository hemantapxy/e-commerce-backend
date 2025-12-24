import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import userRoutes from "./routes/user.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import productRoutes from "./routes/Product.js";

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

// Parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (React Vite frontend)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* -------------------- ROUTES -------------------- */

app.use("/api/user", userRoutes);       // signup, login
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

/* -------------------- DEFAULT ROUTE -------------------- */

app.get("/", (req, res) => {
  res.send("API is running...");
});

/* -------------------- ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

/* -------------------- DATABASE -------------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
