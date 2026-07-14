import mongoose from "mongoose";

const clientStructure = {
    name:{
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    phone : {
        type: String,
        required:true
    },
    company: {
        type: String,
        reuired: true
    },
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },

    //lifeccle

    status:{
        type: String,
        enum: ["active","paused","completed","cancelled"],
        default: "active",
        required: true
    },

    website:{
        type: String
    },

    //contract

    contractValue :{
        type: Number,
    },

    onBoardingDate: {
        type: Date,
        default: Date.now,
        required: true
    },

    renewalDate: {
        type: Date,
    },

    assignedTo: {
        type: String
    },

    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },

    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],

    notes: {
        type: [String],
        default: []
    },

    activities: {
        type: [String],
        default: []
    }
}

const clientSchema = new mongoose.Schema(clientStructure);
const Client = mongoose.model('Client', clientSchema);

export default Client;