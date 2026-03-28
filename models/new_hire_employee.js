import validator from "validator";
import  mongoose  from "mongoose";
import Counter from "./counter.js";

const NewHireEmployeeSchema  = new mongoose.Schema({
    name: { 
        type: String,
         required: [true, "A name is required."], 
         trim: true
    },
    emailAddress:{ 
        
        type: String, 
        required: [true, "An email address is required."],
        unique: true,
        trim: true, 
        lowercase: true, 
        validate:{
            validator: validator.isEmail, 
            message: "Invalid email format.", 
            status: 400
        }
    }, 
    hireDate: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                const today = new Date();
                const startOfToday = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate()
                );
                
                return value < startOfToday;
            },
            message: "Hire date must be in the past.",
            status: 400
        },
    },
    
    employeeID: {
        type: Number, 
        unique: true, 
    },

    userAccessId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    
    
},
    {timestamps: true},

);

NewHireEmployeeSchema.pre("save", async function() {
            if (this.employeeID) return;

            const counter = await Counter.findOneAndUpdate(
                { name: "employeeID" },
                { $inc: { seq: 999999 } },
                { new: true, upsert: true }
            );

            this.employeeID = counter.seq;

        });
        
export default mongoose.model("NewHireEmployee", NewHireEmployeeSchema);