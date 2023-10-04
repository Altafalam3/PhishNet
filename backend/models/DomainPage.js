import mongoose from 'mongoose';

const DomainPageSchema = new mongoose.Schema({
   domainName: {
      type: String,
      required: true,
      unique:true,
   },
   count: {
      type: Number,
      default: 1,
   },
}, { timestamps: true }
);

export default mongoose.model("domainPage", DomainPageSchema)