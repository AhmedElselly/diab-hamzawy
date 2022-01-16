const crypto = require('crypto');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'elselly',
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRETKEY
});

const {CloudinaryStorage} = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'home-run',
    allowedFormats: ['jpeg', 'jpg', 'png'],
    public_id: (req, file) => {
      let buf = crypto.randomBytes(16);
      buf = buf.toString('hex');
      let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
      uniqFileName += buf;
      // cb(undefined, uniqFileName);
    },
    // public_id: (req, file) => 'computed-filename-using-request'
}});

module.exports = {cloudinary, storage};