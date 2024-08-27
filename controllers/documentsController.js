const data = {
  documents: require("../model/documents.json"),
  setDocuments: function (data) {
    this.documents = data;
  },
};

const getAllDocument = (req, res) => {
  res.json(data.documents);
};

const createNewDocument = (req, res) => {
  const newDocument = {
    id: data.documents?.length
      ? data.documents[data.documents.length - 1].id + 1
      : 1,
    type: req.body.type,
    name: req.body.name,
    description: req.body.description,
    company: req.body.company,
    uploadedAt: req.body.uploadedAt,
    imageUrl: req.body.imageUrl,
  };

  if (!newDocument.imageUrl || !newDocument.type) {
    return res.status(400).json({ message: " Photo and Type is Required" });
  }

  data.setDocuments([...data.documents, newDocument]);
  res.status(201).json(data.documents);
};

const updateDocument = (req, res) => {
  const document = data.documents.find(
    (doc) => doc.id === parseInt(req.body.id)
  );
  if (!document) {
    return res
      .status(400)
      .json({ message: `Document ID ${req.body.id} not found` });
  }
  if (req.body.type) document.type = req.body.type;
  if (req.body.name) document.name = req.body.name;
  if (req.body.description) document.description = req.body.description;
  if (req.body.company) document.company = req.body.company;
  if (req.body.uploadedAt) document.uploadedAt = req.body.uploadedAt;
  if (req.body.imageUrl) document.imageUrl = req.body.imageUrl;

  const filteredArray = data.documents.filter(doc => doc.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, document];
    data.setDocuments(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.documents);
};

const deleteDocument = (req, res) => {
  const document = data.documents.find(doc => doc.id === parseInt(req.body.id));
  if(!document){
    return res.status(400).json({"message": `Document ID ${req.body.id} not found`});
  }
  const filteredArray = data.documents.filter(doc => doc.id !== parseInt(req.body.id));
  data.setDocuments([...filteredArray]);
  res.json(data.documents);
};

const getDocument = (req, res) => {
    const document = data.documents.find(doc => doc.id === parseInt(req.params.id));
    if(!document){
      return res.status(400).json({"message": `Document ID ${req.params.id} not found`});
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
