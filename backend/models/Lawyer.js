import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    yearOfExperience: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    idCard: {
      type: String,
      required: true,
    },
    profileImagePublicId: {
      type: String,  // Store the public ID of the profile image in Cloudinary
      required: true,
    },
    idCardPublicId: {
      type: String,  // Store the public ID of the ID card image in Cloudinary
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lawyer", LawyerSchema);
