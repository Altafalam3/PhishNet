import express from "express";
import {
  createReportDomain,
  getAllReportDomains,
  getReportDomainById,
  updateReportDomain,
  deleteReportDomain,
} from "../controllers/reportDomain.js";

const router = express.Router();

// Create a new ReportDomain
router.post("/", createReportDomain);

// Get all ReportDomains
router.get("/", getAllReportDomains);

// Get a ReportDomain by ID
router.get("/:id", getReportDomainById);

// Update a ReportDomain by ID
router.put("/:id", updateReportDomain);

// Delete a ReportDomain by ID
router.delete("/:id", deleteReportDomain);

export default router;
