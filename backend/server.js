import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"

import contactRoute from "./routes/contact.js"
import paymentRoutes from "./routes/payment.js";
import domainPage from "./routes/domainPage.js";
import reportDomain from "./routes/reportDomain.js";

const app = express()
dotenv.config()

// const corsOptions = {
//    origin: 'http://localhost:3000',
//    credentials: true,
// };

const allowedOrigins = ["http://localhost:5500", "http://localhost:3000", "chrome-extension://eafifecgdjhbdnmpodidiiodfdhgofnh"];

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

// Rate limiter middleware (100 requests per 15 minutes per IP)
const limiter = rateLimit({
   windowMs: 10 * 60 * 1000, // 15 minutes
   max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
   message: "Too many requests from this IP, please try again after 15 minutes",
   headers: true,
 });
 
 // Apply the rate limiter to all requests
 app.use(limiter);
 
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