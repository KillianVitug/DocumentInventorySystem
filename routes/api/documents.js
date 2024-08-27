const express = require('express');
const router = express.Router();
const documentsController = require('../../controllers/documentsController');

router.route('/')
    .get(documentsController.getAllDocument)
    .post(documentsController.createNewDocument)
    .put(documentsController.updateDocument)
    .delete(documentsController.deleteDocument);

router.route('/:id')
    .get(documentsController.getDocument);

module.exports = router;
