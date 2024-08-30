const Document = require('../model/Document');

const getAllDocument = async (req, res) => {
  const documents = await Document.find();
  if (!documents)
    return res.status(204).json({ message: 'No document found.' });
  res.json(documents);
};

const createNewDocument = async (req, res) => {
  if (
    !req?.body?.type ||
    !req?.body?.name ||
    !req?.body?.description ||
    !req?.body?.company ||
    !req?.body?.uploadedAt ||
    !req.body.imageUrl
  ) {
    return res.status(400).json({ message: 'All Field Required' });
  }
  try {
    const result = await Document.create({
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      company: req.body.company,
      uploadedAt: req.body.uploadedAt,
      imageUrl: req.body.imageUrl,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateDocument = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'ID parameter is required.' });
  }
  const document = await Document.findOne({ _id: req.body.id }).exec();
  if (!document) {
    return res
      .status(400)
      .json({ message: `No Document matches ID ${req.body.id}.` });
  }
  if (req.body?.type) document.type = req.body.type;
  if (req.body?.name) document.name = req.body.name;
  if (req.body?.description) document.description = req.body.description;
  if (req.body?.company) document.company = req.body.company;
  if (req.body?.uploadedAt) document.uploadedAt = req.body.uploadedAt;
  if (req.body?.imageUrl) document.imageUrl = req.body.imageUrl;
  const result = await document.save();
  res.json(result);
};

const deleteDocument = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'ID parameter is required.' });
  }
  const document = await Document.findOne({ _id: req.body.id }).exec();
  if (!document) {
    return res
      .status(400)
      .json({ message: `No Document matches ID ${req.body.id}.` });
  }
  const result = await document.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getDocument = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'ID parameter is required.' });
  }

  const document = await Document.findOne({ _id: req.params.id }).exec();

  if (!document) {
    return res
      .status(400)
      .json({ message: `No Document matches ID ${req.params.id}.` });
  }
  res.json(document);
};



module.exports = {
  getAllDocument,
  createNewDocument,
  updateDocument,
  deleteDocument,
  getDocument,
};
