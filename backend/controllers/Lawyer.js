import Lawyer from "../models/Lawyer.js";
import cloudinary from '../config/cloudinary.js'; // Import the Cloudinary configuration

export const createLawyer = async (req, res, next) => {
  const { email, name, phone, yearOfExperience } = req.body;
  const profileImage = req.files.profileImage[0];
  const idCard = req.files.idCard[0];

  try {
    // Upload profileImage to Cloudinary
    const profileImageResult = await cloudinary.uploader.upload(profileImage.path);

    // Upload idCard to Cloudinary
    const idCardResult = await cloudinary.uploader.upload(idCard.path);

    const newLawyer = new Lawyer({
      email,
      name,
      phone,
      yearOfExperience,
      profileImage: profileImageResult.secure_url,
      idCard: idCardResult.secure_url,

      // Store the Cloudinary public_ids in MongoDB
      profileImagePublicId: profileImageResult.public_id,
      idCardPublicId: idCardResult.public_id,
    });

    const savedLawyer = await newLawyer.save();
    res.status(200).json(savedLawyer);
  } catch (err) {
    next(err);
  }
};


export const deleteLawyer = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found." });
    }

    // Delete images from Cloudinary using public_ids
    await cloudinary.uploader.destroy(lawyer.profileImagePublicId);
    await cloudinary.uploader.destroy(lawyer.idCardPublicId);

    // Delete lawyer from MongoDB
    await lawyer.remove();

    res.status(200).json({ message: "Lawyer has been deleted." });
  } catch (err) {
    next(err);
  }
};



export const getLawyer = async (req, res, next) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found." });
    }

    // Retrieve the image URLs from Cloudinary
    const profileImage = await cloudinary.url(lawyer.profileImage, { secure: true });
    const idCard = await cloudinary.url(lawyer.idCard, { secure: true });

    // Create a new lawyer object with image URLs
    const lawyerWithImages = {
      ...lawyer._doc,
      profileImage,
      idCard,
    };

    res.status(200).json(lawyerWithImages);
  } catch (err) {
    next(err);
  }
};


export const getLawyers = async (req, res, next) => {
  const { city } = req.query;

  try {
    let query = Lawyer.find();

    if (city) {
      query = query.where({ city }); // Apply city filter if provided
    }

    const lawyers = await query.exec();

    if (lawyers.length === 0) {
      return res.status(404).json({ error: "No lawyers found." });
    }

    const lawyersWithImages = await Promise.all(
      lawyers.map(async (lawyer) => {
        // Construct Cloudinary URLs using public IDs
        const profileImage = await cloudinary.url(lawyer.profileImagePublicId, { secure: true });
        const idCard = await cloudinary.url(lawyer.idCardPublicId, { secure: true });

        // Create a new lawyer object with image URLs
        return {
          ...lawyer._doc,
          profileImage,
          idCard,
        };
      })
    );

    res.status(200).json(lawyersWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
};



// export const getLawyers = async (req, res, next) => {
//   const { city } = req.query;

//   try {
//     if (city) {
//       const lawyers = await Lawyer.find({ city });
//       const lawyersWithImages = await Promise.all(
//         lawyers.map(async (lawyer) => {
//           // Retrieve the image URLs from Cloudinary
//           const profileImage = await cloudinary.url(lawyer.profileImage, { secure: true });
//           const idCard = await cloudinary.url(lawyer.idCard, { secure: true });

//           // Create a new lawyer object with image URLs
//           return {
//             ...lawyer._doc,
//             profileImage,
//             idCard,
//           };
//         })
//       );
//       res.status(200).json(lawyersWithImages);
//     }

//     else {
//       const lawyers = await Lawyer.find();
//       const lawyersWithImages = await Promise.all(
//         lawyers.map(async (lawyer) => {
//           // Retrieve the image URLs from Cloudinary
//           const profileImage = await cloudinary.url(lawyer.profileImage, { secure: true });
//           const idCard = await cloudinary.url(lawyer.idCard, { secure: true });

//           // Create a new lawyer object with image URLs
//           return {
//             ...lawyer._doc,
//             profileImage,
//             idCard,
//           };
//         })
//       );
//       res.status(200).json(lawyersWithImages);
//     }
//   }

//   catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// };
