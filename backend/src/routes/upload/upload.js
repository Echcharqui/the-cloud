require('dotenv').config();
const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mergeChunks = async (fileName, totalChunks) => {
    const chunkDir = path.join(__dirname, "chunks");
    const mergedFilePath = path.join(__dirname, "merged_files");

    if (!fs.existsSync(mergedFilePath)) {
        fs.mkdirSync(mergedFilePath);
    }

    const writeStream = fs.createWriteStream(path.join(mergedFilePath, fileName));
    for (let i = 0; i < totalChunks; i++) {
        const chunkFilePath = path.join(chunkDir, `${fileName}.part_${i}`);
        const chunkBuffer = await fs.promises.readFile(chunkFilePath);
        writeStream.write(chunkBuffer);
        fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging
    }

    writeStream.end();
    console.log("Chunks merged successfully");
};

router.post("/v1", upload.single("file"), async (req, res) => {
    console.log("Hit");
    const chunk = req.file.buffer;
    const chunkNumber = Number(req.body.chunkNumber); // Sent from the client
    const totalChunks = Number(req.body.totalChunks); // Sent from the client
    const fileName = req.body.originalname;

    const chunkDir = path.join(__dirname, "chunks"); // Directory to save chunks

    if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir);
    }

    const chunkFilePath = path.join(chunkDir, `${fileName}.part_${chunkNumber}`);

    try {
        await fs.promises.writeFile(chunkFilePath, chunk);
        console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);

        if (chunkNumber === totalChunks - 1) {
            // If this is the last chunk, merge all chunks into a single file
            await mergeChunks(fileName, totalChunks);
            console.log("File merged successfully");
        }

        res.status(200).json({ message: "Chunk uploaded successfully" });
    } catch (error) {
        console.error("Error saving chunk:", error);
        res.status(500).json({ error: "Error saving chunk" });
    }
});

module.exports = router;
