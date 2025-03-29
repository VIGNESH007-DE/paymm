const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('screenshot'), (req, res) => {
    if (!req.file || !req.body.address) {
        return res.status(400).json({ success: false, message: "Missing file or address" });
    }

    // Email Configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'your-email@gmail.com',
        subject: 'New Harvest Vehicle Payment',
        text: `A new payment has been submitted.\n\nAddress: ${req.body.address}`,
        attachments: [
            {
                filename: req.file.originalname,
                path: req.file.path
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Failed to send email" });
        }
        res.json({ success: true, message: "Payment details submitted successfully" });
    });
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
