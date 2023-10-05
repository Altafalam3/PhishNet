import ReportDomain from "../models/ReportDomain.js";

// Create a new ReportDomain
export const createReportDomain = async (req, res) => {
   try {
      // console.log(req.body);
      const { domainName, emailId, details, category } = req.body;
      const newReportDomain = new ReportDomain({ domainName, emailId, details, category });
      await newReportDomain.save();
      return res.status(201).json(newReportDomain);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Get all ReportDomains
export const getAllReportDomains = async (req, res) => {
   try {
      const reportDomains = await ReportDomain.find();
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

      return res.status(200).json(updatedReportDomain);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Delete a ReportDomain by ID
export const deleteReportDomain = async (req, res) => {
   try {
      const { id } = req.params;
      const deletedReportDomain = await ReportDomain.findByIdAndRemove(id);

      if (!deletedReportDomain) {
         return res.status(404).json({ message: "ReportDomain not found" });
      }

      return res.status(200).json({ message: "ReportDomain deleted successfully" });
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};
