const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
require("dotenv").config();
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['text/plain', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG, or PDF files are allowed!"));
        }
        cb(null, true);
    },
});

const s3 = new S3Client({ region: process.env.AWS_REGION });

function generateFileKey(originalName) {
    const ext = originalName.split(".").pop();
    return `${crypto.randomUUID()}.${ext}`;
}

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileKey = generateFileKey(req.file.originalname);

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            Metadata: {
                originalName: req.file.originalname,
                uploadedAt: new Date().toISOString(),
            },
        });

        await s3.send(command);

        const signedUrl = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey,
        }), { expiresIn: 3600 }); 

        res.json({
            message: "File uploaded successfully",
            fileUrl: signedUrl,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message.includes("Only")) {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});