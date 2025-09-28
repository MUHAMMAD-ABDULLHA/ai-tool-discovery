// import mongoose from "mongoose";

// const toolSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     logo: String,
//     category: String,
//     description: String,
//     pricing: String,
//     useCases: [String],
//     link: String,
//     createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("Tool", toolSchema);


import mongoose from "mongoose";

const toolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: String,
    category: String,
    description: String,
    pricing: String,
    useCases: [String],
    link: String,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Tool", toolSchema);
