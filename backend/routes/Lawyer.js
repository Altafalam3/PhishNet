import express from "express";
import { deleteLawyer, createLawyer, getLawyer, getLawyers } from "../controllers/Lawyer.js";
import multer from 'multer';

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      // Specify the destination directory where files will be stored
      cb(null, 'uploads/'); // Change 'uploads/' to your desired directory
   },
   filename: function (req, file, cb) {
      // Define how the file should be named
      cb(null, file.originalname); // You can customize the file naming logic
   },
});

const upload = multer({ storage: storage });

const router = express.Router();

//create
router.post('/', upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'idCard', maxCount: 1 }]), createLawyer);

//delete
router.delete("/:id", deleteLawyer);

//get
router.get("/find/:id", getLawyer);

//get all
router.get("/", getLawyers);

export default router