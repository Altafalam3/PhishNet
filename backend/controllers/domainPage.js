import DomainPage from "../models/DomainPage.js";

// Create a new DomainPage
export const createDomainPage = async (req, res) => {
   try {
      const { domainName } = req.body;

      // Check if the domainName already exists
      const existingDomainPage = await DomainPage.findOne({ domainName });

      if (existingDomainPage) {
         // If it exists, increment the count and update the document
         existingDomainPage.count += 1;
         await existingDomainPage.save();
         return res.status(200).json(existingDomainPage);
      } else {
         // If it doesn't exist, create a new document
         const newDomainPage = new DomainPage({ domainName });
         await newDomainPage.save();
         return res.status(201).json(newDomainPage);
      }
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Get all DomainPages
export const getAllDomainPages = async (req, res) => {
   try {
      const domainPages = await DomainPage.find();
      return res.status(200).json(domainPages);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Get a DomainPage by ID
export const getDomainPageById = async (req, res) => {
   try {
      const { id } = req.params;
      const domainPage = await DomainPage.findById(id);

      if (!domainPage) {
         return res.status(404).json({ message: "DomainPage not found" });
      }

      return res.status(200).json(domainPage);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Update a DomainPage by ID
export const updateDomainPage = async (req, res) => {
   try {
      const { id } = req.params;
      const { domainName, count } = req.body;
      const updatedDomainPage = await DomainPage.findByIdAndUpdate(
         id,
         { domainName, count },
         { new: true }
      );

      if (!updatedDomainPage) {
         return res.status(404).json({ message: "DomainPage not found" });
      }

      return res.status(200).json(updatedDomainPage);
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};

// Delete a DomainPage by ID
export const deleteDomainPage = async (req, res) => {
   try {
      const { id } = req.params;
      const deletedDomainPage = await DomainPage.findByIdAndRemove(id);

      if (!deletedDomainPage) {
         return res.status(404).json({ message: "DomainPage not found" });
      }

      return res.status(200).json({ message: "DomainPage deleted successfully" });
   } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
   }
};
