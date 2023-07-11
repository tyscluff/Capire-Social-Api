import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';
import path from 'path';

const MONGO_URI = "mongodb+srv://capireDB:T3OibLT0P62QXP4C@beta2.2qyop.mongodb.net/?retryWrites=true&w=majority";

const conn = mongoose.createConnection(MONGO_URI);

let gfs = { stream: null };

conn.once("open", () => {
    console.log("GFS connected");
    gfs.stream = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "images"
    })
});

const storage = new GridFsStorage({
    url: MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = req.get("templateId");
            const fileInfo = { 
                filename,
                bucketName: "images"
            }
            resolve(fileInfo);
        });
    }
});

const store = multer({
    storage,
    limits: { fileSize: 200000000 }, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb) 
    }
});

const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|heic/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('filetype');
};

const uploadMiddleware = (req, res, next) => {
    const upload = store.single("image");
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: "error" })
        } else if (err) {
            if (err === "filetype") return res.status(400).send({ message: "Image files only" });
        }
        next();
    })
};

const deleteImage = (id) => {
    if (!id || id === 'undefined') return res.status(400).send('no image id');
    const _id = new mongoose.Types.ObjectId(id);
    gfs.stream.delete(_id, (err) => {
      if (err) return res.status(500).send('image deletion error');
    });
};

const gfsObject = {
    uploadMiddleware: uploadMiddleware,
    gfs: gfs,
    deleteImage: deleteImage
}

export default gfsObject