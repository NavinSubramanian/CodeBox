const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MongoDB URI is not defined');
        }
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            retryWrites: true,
            w: 'majority',
        });
        const db = mongoose.connection;
        db.once('open', () => console.log('Connected to MongoDB'));
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
module.exports = connectDB;
