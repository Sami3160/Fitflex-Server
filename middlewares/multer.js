const upload = require('../config/multer.config')

const FileUpload = (req, res, next) => {
    const uploadSingle = upload.single("image")
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.log()
            console.log("Error in multer.js FileUpload() :", err.message)
            return res.status(500).json({ error: err, message: "Error in uploading file inside middleware" });
        }
        if (!req.file) {
            next();
            return;
        } else {
            next();
        }
    })
}

module.exports = FileUpload