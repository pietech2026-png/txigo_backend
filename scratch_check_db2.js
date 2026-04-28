import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const db = mongoose.connection;
      const drivers = await db.collection('drivers').find({}).sort({ _id: -1 }).limit(10).toArray();
      const withDocs = drivers.filter(d => d.documents);
      console.log("Total recent:", drivers.length, "With docs:", withDocs.length);
      if (withDocs.length > 0) {
          console.log("Sample with doc:", JSON.stringify(withDocs[0].documents, null, 2));
      }
    } catch (e) {
      console.log(e.message);
    }
    process.exit(0);
  });
