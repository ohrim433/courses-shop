const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'images');
    },
    filename(req, file, callback) {
        // I used replace(/:/g, '-') because my OS is Windows
        callback(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, callback) => {
     if (allowedTypes.includes(file.mimetype)) {
         callback(null, true);
     } else {
         callback(null, false);
     }
};

module.exports = multer({
    storage,
    fileFilter
});
