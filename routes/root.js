const express = require('express');
const router = express.Router();
const path = require('path');
const Document = require('../model/Document');
const multer = require('multer');
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + '_' + Date.now() + '_' + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single('imageUrl');

router.post('/addDocumentPage', upload, async (req, res) => {
  try {
    const document = new Document({
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      company: req.body.company,
      uploadedAt: req.body.uploadedAt,
      imageUrl: req.file ? req.file.path : null,
    });

    await document.save();

    req.session.message = {
      type: 'success',
      message: 'Document added successfully!',
    };
    res.redirect('/');
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});

//List All Documents
router.get('^/$|/index', async (req, res) => {
  try {
    const documents = await Document.find().exec();
    res.render('index', {
      title: 'Home Page',
      documents: documents,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

//Add Document
router.get('/addDocumentPage', (req, res) => {
  res.render('addDocumentPage', { title: 'Add Document' });
});

//View Specific Document
router.get('/viewDocumentPage/:id', async (req, res) => {
  let id = req.params.id;
  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.redirect('/');
    }
    res.render('viewDocumentPage', {
      title: 'View Document',
      document: document,
    });
  } catch (err) {
    res.redirect('/');
  }
});

//Edit Specific Document
router.get('/editDocumentPage/:id', async (req, res) => {
  let id = req.params.id;
  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.redirect('/');
    }
    res.render('editDocumentPage', {
      title: 'Edit Document',
      document: document,
    });
  } catch (err) {
    res.redirect('/');
  }
});

//Update Document
router.post('/update/:id', upload, async (req, res) => {
  let id = req.params.id;
  let new_image = '';

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/' + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    await Document.findByIdAndUpdate(id, {
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      company: req.body.company,
      uploadedAt: req.body.uploadedAt,
      imageUrl: new_image,
    });

    req.session.message = {
      type: 'success',
      message: 'Document Updated Successfully!',
    };
    res.redirect('/');
  } catch (err) {
    res.json({ message: err.message, type: 'danger' });
  }
});

module.exports = router;
