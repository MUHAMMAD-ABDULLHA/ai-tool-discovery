import express from "express";
import Tool from "../model/Tool.js";

const router = express.Router();

// List Tools
router.get("/", async (req, res) => {
    try {
        const tools = await Tool.find();
        res.json(tools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/:id", async(req, res )=>{
    try {
        const tool = await Tool.findById(req.params.id);
        console.log(tool);
        res.json(tool);
    }catch (err){
        res.status(500).json({ error: err.message });
    }
})
// Add Tool
// router.post("/", async (req, res) => {
//     try {
//         const newTool = new Tool(req.body);
//         const savedTool = await newTool.save();
//         res.status(201).json(savedTool);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

router.post("/", authMiddleware, async (req, res) => {
  try {
    const newTool = new Tool({
      ...req.body,
      userId: req.user.id, // 🔹 attach the creator's ID
    });

    const savedTool = await newTool.save();
    res.status(201).json(savedTool);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/category/:category", async (req, res) => {
    try {
        const tools = await Tool.find({ category: req.params.category });
        if (!tools.length) {
            return res.status(404).json({ error: "No tools found in this category" });
        }
        res.json(tools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default router;
