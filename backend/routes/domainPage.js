import express from "express";
import {
  createDomainPage,
  getAllDomainPages,
  getDomainPageById,
  updateDomainPage,
  deleteDomainPage,
} from "../controllers/domainPage.js";

const router = express.Router();

// Create a new DomainPage
router.post("/", createDomainPage);

// Get all DomainPages
router.get("/", getAllDomainPages);

// Get a DomainPage by ID
router.get("/:id", getDomainPageById);

// Update a DomainPage by ID
router.put("/:id", updateDomainPage);

// Delete a DomainPage by ID
router.delete("/:id", deleteDomainPage);

export default router;
