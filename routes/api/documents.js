const express = require('express');
const router = express.Router();
const documentsController = require('../../controllers/documentsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyJWT = require('../../middleware/verifyJWT');
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
var storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, './uploads');
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    // Sanitize filename to avoid issues
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_');
    const fileName = `${uniqueSuffix}_${sanitizedOriginalName}`;
    cb(null, fileName);
  },
});

const FILE_TYPES = /jpeg|jpg|png|gif/;
const fileFilter = (req, file, cb) => {
  const extname = FILE_TYPES.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = FILE_TYPES.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

// Initialize Multer with storage, file filter, and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).array('images', 10); // Expect 'images' field with up to 10 files

// Document-related routes
router.get('^/$|/index', documentsController.getAllDocuments);
router.post('/', upload, documentsController.createNewDocument);
router.get('/:id', documentsController.getDocument);
router.patch('/:id', upload, documentsController.updateDocument);
router.get('/downloadPdf/:id/:index?', documentsController.downloadPdf);
router.delete('/:id', documentsController.deleteDocument);

module.exports = router;
