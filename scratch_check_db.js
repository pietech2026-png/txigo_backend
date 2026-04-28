import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const Driver = mongoose.connection.collection('drivers');
      const drivers = await Driver.find().sort({ _id: -1 }).limit(3).toArray();
      console.log(JSON.stringify(drivers, null, 2));
    } catch (e) {
      console.log(e.message);
    }
    process.exit(0);
  });
