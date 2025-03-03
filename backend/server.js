import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import cors from "cors";

// import { rateLimiter } from './middleware/rateLimiter.js'; // Import the rate limiter middleware
// import { createClient } from "redis";

import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"

import contactRoute from "./routes/contact.js"
import paymentRoutes from "./routes/payment.js";
import domainPage from "./routes/domainPage.js";
import reportDomain from "./routes/reportDomain.js";

const app = express()
dotenv.config()

// // Redis client setup
// export const redisClient = createClient();
// redisClient.connect().catch(console.error);

// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// redisClient.on('error', (err) => {
//   console.error(`Redis error: ${err}`);
// });

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5500",
  "http://localhost:3000",
  "chrome-extension://eafifecgdjhbdnmpodidiiodfdhgofnh",
];

// Configure CORS to allow requests from the specified origins
const corsOptions = {
   origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
      } else {
         callback(new Error("Not allowed by CORS"));
      }
   },
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   credentials: true,
   optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Apply the rate limiter to all requests
// app.use(rateLimiter);
 
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
app.use("/api/pay", paymentRoutes)
app.use("/api/domainpage", domainPage)
app.use("/api/reportdomain", reportDomain)


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