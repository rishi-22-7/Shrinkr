const mongoose = require('mongoose');
const Counter = require('../models/Counter');

const COUNTER_ID = 'url_count';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected`);

    await Counter.findOneAndUpdate(
      { _id: COUNTER_ID },
      { $setOnInsert: { sequence_value: 999 } },
      { upsert: true }
    );
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
