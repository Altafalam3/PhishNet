import mongoose from 'mongoose';

const ReportDomainSchema = new mongoose.Schema({
   domainName: {
      type: String,
      required: true,
   },
   emailId: {
      type: String,
      required: true,
   },
   details: {
      type: String,
      required: true,
   },
   category: {
      type: String,
      required: true,
   },
}, { timestamps: true }
);

export default mongoose.model("reportDomain", ReportDomainSchema)