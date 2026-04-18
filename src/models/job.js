import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  company: String,
  location: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

//Ye check karta hai:
// Agar model already bana hua hai → usi ko use karo
// Nahi hai → naya bana lo
const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
export default Job;