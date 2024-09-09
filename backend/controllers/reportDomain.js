import ReportDomain from "../models/ReportDomain.js";

import { redisClient } from "../server.js"; // Import Redis client from server.js

// Key for caching all report domains
const REPORT_DOMAIN_CACHE_KEY = 'reportDomains';

// Create a new ReportDomain
export const createReportDomain = async (req, res) => {
   try {
      const { domainName, emailId, details, category } = req.body;
      const newReportDomain = new ReportDomain({ domainName, emailId, details, category });
      await newReportDomain.save();

      // Invalidate the cache after creating a new report domain
      await redisClient.del(REPORT_DOMAIN_CACHE_KEY);

      return res.status(201).json(newReportDomain);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Get all ReportDomains with Redis caching
export const getAllReportDomains = async (req, res) => {
   try {
      // Check if data is available in the cache
      const cachedData = await redisClient.get(REPORT_DOMAIN_CACHE_KEY);

      if (cachedData) {
         // If cache exists, return it
         return res.status(200).json(JSON.parse(cachedData));
      }

      // If cache does not exist, query the database
      const reportDomains = await ReportDomain.find();

      // Cache the result with an expiry of 60 minutes (3600 seconds)
      // redisClient.setEx(REPORT_DOMAIN_CACHE_KEY, 60*60, JSON.stringify(reportDomains));
      redisClient.set(REPORT_DOMAIN_CACHE_KEY, JSON.stringify(reportDomains));

      // Return the response
      return res.status(200).json(reportDomains);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Get a ReportDomain by ID
export const getReportDomainById = async (req, res) => {
   try {
      const { id } = req.params;
      const reportDomain = await ReportDomain.findById(id);

      if (!reportDomain) {
         return res.status(404).json({ message: "ReportDomain not found" });
      }

      return res.status(200).json(reportDomain);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Update a ReportDomain by ID
export const updateReportDomain = async (req, res) => {
   try {
      const { id } = req.params;
      const { domainName, emailId, details, category } = req.body;
      const updatedReportDomain = await ReportDomain.findByIdAndUpdate(
         id,
         { domainName, emailId, details, category },
         { new: true }
      );

      if (!updatedReportDomain) {
         return res.status(404).json({ message: "ReportDomain not found" });
      }

      // Invalidate the cache after updating the report domain
      await redisClient.del(REPORT_DOMAIN_CACHE_KEY);

      return res.status(200).json(updatedReportDomain);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

]// Delete a ReportDomain by ID
export const deleteReportDomain = async (req, res) => {
   try {
      const { id } = req.params;
      const deletedReportDomain = await ReportDomain.findByIdAndRemove(id);

      if (!deletedReportDomain) {
         return res.status(404).json({ message: "ReportDomain not found" });
      }

      // Invalidate the cache after deleting a report domain
      await redisClient.del(REPORT_DOMAIN_CACHE_KEY);

      return res.status(200).json({ message: "ReportDomain deleted successfully" });
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};
