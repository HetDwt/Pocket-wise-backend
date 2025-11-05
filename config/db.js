const mangoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mangoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB Connected 🌐");
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error in connecting to MongoDB: ${error.message}`);
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
