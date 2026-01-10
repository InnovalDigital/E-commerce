const multer = require('multer');

const storage = multer.memoryStorage(); // store in buffer

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
