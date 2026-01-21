require('dotenv').config(); // ✅ FIX HERE
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/mongoose-connection');
const morgan = require('morgan');
const app = express();

app.use(cookieParser());

// Connect MongoDB
connectDB();
app.use(morgan('dev'));


// ===== MIDDLEWARE =====
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
const homeRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/usersRouter');
const ownersRouter = require('./src/routes/ownersRouter');
const productsRouter = require('./src/routes/productsRouter');


app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/owners', ownersRouter);
app.use('/products', productsRouter);


// ===== SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
