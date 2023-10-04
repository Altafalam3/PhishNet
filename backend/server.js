import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import lawyerRoute from "./routes/Lawyer.js"

import contactRoute from "./routes/contact.js"


const app = express()
dotenv.config()

const corsOptions = {
   origin: 'http://localhost:3000',
   credentials: true,
};

app.use(cors(corsOptions));


const connect = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log("connected to mongodb")
   } catch (error) {
      throw error;
   }
};


mongoose.connection.on("disconnected", () => {
   console.log("mongodb disconnected")
})

mongoose.connection.on("connected", () => {
   console.log("mongodb connected")
})

app.get('/', (req, res) => {
   res.send("Hello")
})


//middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/lawyer", lawyerRoute);


app.use("/api/contact", contactRoute);




app.use((err, req, res, next) => {
   const errorStatus = err.status || 500;
   const errorMessage = err.message || "Something went wrong"
   return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack
   })
})


const port = process.env.PORT || 8800;
const host = '0.0.0.0'

app.listen(port, host, () => {
   connect()
   console.log("connected to backend")
})