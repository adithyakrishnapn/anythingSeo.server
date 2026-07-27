import app from './app.js';
import env from './config/env.js';
import connectDB from './config/db.js';
import { startLeadScheduler } from './scheduler/lead.scheduler.js';


const startServer = async()=>{
  try{
    await connectDB();
    startLeadScheduler();
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error(`Error starting server: ${err.message}`);
    process.exit(1);
  }
};

startServer();