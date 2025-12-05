const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${file.fieldname}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|mp4|mp3|webm|ogg/
  const isAllowed = allowedTypes.test(file.mimetype.toLowerCase())
  if (isAllowed) cb(null, true)
  else cb(new Error('Invalid file type'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, 
})

module.exports = upload
