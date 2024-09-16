const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const leaderboardRouter = require('./routes/leaderboard');

// Use the leaderboard router
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();

connectDB();

const app = express();
const corsOptions = {
    origin: '*', // Replace with your frontend URL
    credentials: true, // This allows cookies to be sent with the requests
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/leaderboard', leaderboardRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
