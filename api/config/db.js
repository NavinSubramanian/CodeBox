const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MongoDB URI is not defined');
        }
        const conn = await mongoose.connect("mongodb://nnavinsubramaniancse2021:40OwVo3jyL117KIK@testcluster-shard-00-00.ovyt5.mongodb.net:27017,testcluster-shard-00-01.ovyt5.mongodb.net:27017,testcluster-shard-00-02.ovyt5.mongodb.net:27017/?ssl=true&",{
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
