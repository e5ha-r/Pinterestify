import mongoose from "mongoose";
import Pin from "./models/Pin.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const totalPins = await Pin.countDocuments();
    const latestPins = await Pin.find().sort({ createdAt: -1 }).limit(3);
    console.log(`Total pins in DB: ${totalPins}`);
    console.log("Latest pins:", JSON.stringify(latestPins, null, 2));
    process.exit(0);
});
