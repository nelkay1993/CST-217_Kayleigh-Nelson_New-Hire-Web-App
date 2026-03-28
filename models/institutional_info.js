import mongoose from "mongoose";

const InstitutionInfoSchema = new mongoose.Schema({
    title: { type: String, required: true},
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    mailAddress: { type: String, required: true },
    staffTotal: { type: Number, required: true },
    searchId: {type: String, required: true}

},
{timestamps: true}

);
export default  mongoose.model("InstitutionInfoSession", InstitutionInfoSchema);
