import mongoose from "mongoose";
import Counter from "./counter.js";
import session from "express-session";

const InstitutionInfoSchema = new mongoose.Schema({
    title: { type: String, required: true},
    phoneNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    mailAddress: { type: String, required: true },
    staffTotal: { type: Number, required: true },
    searchId: {type: String }

},
    {timestamps: true}


);

InstitutionInfoSchema.pre("save", async function() {

    if(!this.isNew || this.searchId ) return;

    let counter = await Counter.findOne({name: "searchId"});
    if (!counter) {
        counter = new Counter({ name: "searchId", $set:{seq: 16 } });
    }
    else{
        counter = await Counter.findOneAndUpdate(
            { name: "searchId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
    }

    this.searchId = `delta_main_campus_${counter.seq.toString().padStart(4, "0")}`;
});

export default  mongoose.model("InstitutionInfoSession", InstitutionInfoSchema);
