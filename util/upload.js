const multer = require('multer');
const path = require('path');

// setting multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })
 
  const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' 
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  
  module.exports = multer({ storage: storage, fileFilter: fileFilter })