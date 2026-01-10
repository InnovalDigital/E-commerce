require('dotenv').config(); // ✅ FIX HERE
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/mongoose-connection');
const app = express();
app.use(cookieParser());

// Connect MongoDB
connectDB();



// ===== MIDDLEWARE =====
app.use(cors({
  origin: "https://e-commerce-ruddy-eta.vercel.app/", // Vite frontend
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
const homeRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/usersRouter');

app.use('/', homeRouter);
app.use('/users', usersRouter);

// ===== SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
