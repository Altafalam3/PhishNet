// import { redisClient } from '../server.js'; // Assuming you set up Redis in server.js

// // Set your rate limit configuration
// const WINDOW_SIZE_IN_SECONDS = 60;  // 1 minute window
// const MAX_WINDOW_REQUEST_COUNT = 20; // Maximum of 20 requests per window

// export const rateLimiter = async (req, res, next) => {
//    const userIP = req.ip; // Use the IP of the user

//    try {
//       // Check if the IP is already in Redis
//       const requestCount = await redisClient.get(userIP);

//       if (requestCount) {
//          const count = parseInt(requestCount);

//          if (count >= MAX_WINDOW_REQUEST_COUNT) {
//             // If the request count has exceeded the maximum, get the remaining TTL
//             const ttl = await redisClient.ttl(userIP);
//             res.set('Retry-After', ttl);
//             return res.status(429).json({
//                message: `Rate limit exceeded. Try again in ${ttl} seconds.`,
//                ttl: ttl
//             });
//          }

//          // Increment the request count
//          await redisClient.incr(userIP);
//       } else {
//          // If no count exists for this IP, set it with an expiration time
//          await redisClient.set(userIP, 1, 'EX', WINDOW_SIZE_IN_SECONDS);
//       }

//       next();  // Proceed to the next middleware if rate limit is not exceeded
//    } catch (err) {
//       console.error('Rate limiter error:', err);
//       return res.status(500).json({ message: 'Internal Server Error' });
//    }
// };
