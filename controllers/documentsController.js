const Document = require('../model/Document');
const path = require('path'); // Ensure this is present at the top of your file
const fs = require('fs');
const fsPromises = require('fs').promises;
const PDFDocument = require('pdfkit');
const archiver = require('archiver');

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({}).sort({ uploadedAt: -1 });
    if (!documents) {
      return res.status(404).json({ message: 'No documents found' }); // Add 'return' to prevent further execution
    }
    return res.status(200).json(documents); // Ensure only one response is sent
  } catch (error) {
    return res.status(500).json({ message: error.message }); // Add 'return' here too
  }
};

const createNewDocument = async (req, res) => {
  try {
    const document = new Document({
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      company: req.body.company,
      uploadedAt: req.body.uploadedAt,
      imageUrl: req.files.map((file) => `/uploads/${file.filename}`),
    });

    await document.save();

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ message: err.message, type: 'danger' });
  }
};

const updateDocument = async (req, res) => {
  const id = req.params.id;
  let new_images = [];

  if (req.files && req.files.length > 0) {
    new_images = req.files.map((file) => `/uploads/${file.filename}`); // Store as '/uploads/<filename>'

    let old_images = [];
    if (Array.isArray(req.body.old_images)) {
      old_images = req.body.old_images;
    } else if (typeof req.body.old_images === 'string') {
      try {
        old_images = JSON.parse(req.body.old_images);
      } catch (error) {
        old_images = [req.body.old_images];
      }
    }

    old_images.forEach((old_image) => {
      const oldImagePath = path.join(__dirname, '../', old_image); // '/uploads/<filename>'
      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log(`Deleted old image at: ${oldImagePath}`);
        } else {
          console.log('Old Image Not Found At:', oldImagePath);
        }
      } catch (err) {
        console.log('Error Deleting Old Image:', err);
      }
    });
  } else {
    if (Array.isArray(req.body.old_images)) {
      new_images = req.body.old_images;
    } else if (typeof req.body.old_images === 'string') {
      try {
        new_images = JSON.parse(req.body.old_images);
      } catch (error) {
        new_images = [req.body.old_images];
      }
    }
  }

  try {
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      {
        type: req.body.type,
        name: req.body.name,
        description: req.body.description,
        company: req.body.company,
        uploadedAt: req.body.uploadedAt,
        imageUrl: new_images,
      },
      { new: true } // Return the updated document
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    req.session.message = {
      type: 'success',
      message: 'Document Updated Successfully!',
    };
    res.status(200).json(updatedDocument); // Respond with the updated document
  } catch (err) {
    console.error('Error updating document:', err);
    res.status(500).json({ message: err.message, type: 'danger' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await Document.findByIdAndDelete(id);

    if (result && result.imageUrl && Array.isArray(result.imageUrl)) {
      result.imageUrl.forEach((imagePath) => {
        const filePath = imagePath.includes('uploads')
          ? path.join(__dirname, '../', imagePath) // Use the imagePath as is if it already includes 'uploads'
          : path.join(__dirname, '../uploads', imagePath); // Append 'uploads' if it's not already there

        // Check if the file exists before attempting to delete it
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.log('Error deleting file:', err);
          }
        } else {
          console.log('File not found:', filePath);
        }
      });
    }

    req.session.message = {
      type: 'info',
      message: 'Document Deleted Successfully!',
    };
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ message: err.message });
  }
};

const getDocument = async (req, res) => {
  let id = req.params.id;
  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document); // Return the document data
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const downloadPdf = async (req, res) => {
  try {
    const documentId = req.params.id;

    // Fetch the document from the database
    const document = await Document.findById(documentId);

    if (!document || !document.imageUrl || document.imageUrl.length === 0) {
      return res.status(404).send('No images found for this document.');
    }

    if (document.imageUrl.length === 1) {
      const imagePath = document.imageUrl[0].includes('uploads')
        ? path.join(__dirname, '../', document.imageUrl[0])
        : path.join(__dirname, '../uploads', document.imageUrl[0]);

      try {
        await fsPromises.access(imagePath); // Check if the file exists

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${path.basename(
            imagePath,
            path.extname(imagePath)
          )}.pdf`
        );
        doc.pipe(res);
        doc.image(imagePath, {
          fit: [500, 400],
          align: 'center',
          valign: 'center',
        });
        doc.end();
      } catch (err) {
        res.status(404).send('Image not found.');
      }
    } else {
      const zipName = `images_${documentId}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=${zipName}`);

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(res);

      const pdfPromises = document.imageUrl.map(async (image, index) => {
        const imagePath = image.includes('uploads')
          ? path.join(__dirname, '../', image)
          : path.join(__dirname, '../uploads', image);

        console.log(`Processing image path: ${imagePath}`);

        try {
          await fsPromises.access(imagePath); // Check if the file exists

          const pdfDoc = new PDFDocument();
          const pdfPath = path.join(
            __dirname,
            `../temp_${documentId}_${index}.pdf`
          );
          const writeStream = fs.createWriteStream(pdfPath);

          pdfDoc.pipe(writeStream);
          pdfDoc.image(imagePath, {
            fit: [500, 400],
            align: 'center',
            valign: 'center',
          });
          pdfDoc.end();

          await new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
              console.log(`Generated PDF: ${pdfPath}`);
              archive.file(pdfPath, { name: `image_${index}.pdf` });
              // Delay file deletion to ensure Archiver has finished reading it
              setTimeout(() => {
                fs.unlink(pdfPath, (err) => {
                  if (err) reject(err); // Clean up the temporary PDF file
                  resolve();
                });
              }, 100); // Adjust delay as needed
            });

            writeStream.on('error', reject);
          });
        } catch (err) {
          console.log(`Error processing image: ${imagePath}`, err);
        }
      });

      // Wait for all PDFs to be processed
      Promise.all(pdfPromises)
        .then(() => {
          console.log('All PDFs added to the archive.');
          archive.finalize(); // Finalize the archive after all PDFs are added
        })
        .catch((err) => {
          console.log('Error processing PDFs:', err);
          res.status(500).send('Error generating PDF files');
        });
    }
  } catch (err) {
    console.log('Error generating PDF or zip:', err);
    res.status(500).send('Error generating file');
  }
};

module.exports = {
  getAllDocuments,
  createNewDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  downloadPdf,
};
