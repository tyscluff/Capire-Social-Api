import { Router } from 'express';
import mongoose from 'mongoose';
import gfsObject from '../gfs/gfsConfig.js';
import StreamImageInfo from '../models/streamImageInfoModel.js';
import errorLogger from '../logger/errorLogger.js';

const uploadMW = gfsObject.uploadMiddleware;
const deleteImage = gfsObject.deleteImage;
const gfs = gfsObject.gfs;

const router = Router();

router.post("/uploadTemplateImage", uploadMW, async (req, res) => {
    try {
        const fileId = req.file.id; 
        const streamImageInfo = new StreamImageInfo({
            templateId: req.get("templateId"),
            imageId: fileId
        });
 
        streamImageInfo.save((error) => {
            if (error) {
                errorLogger.error(error);
                res.send({ message: 1 }); 
            } else {
                res.send({ message: 0 })  
            }
        });
    } catch (error) {
        errorLogger.error(error);
        res.send({ message: 1 }); 
    }
});
 
router.get("/templateImage/:templateId", async (req, res) => {
    try {
        const { templateId } = req.params;
        const exists = await StreamImageInfo.exists({ templateId });
        if (exists) {
            const correctImageInfo = await StreamImageInfo.findOne({ templateId });
            const correctImageId = await correctImageInfo.imageId;
            const _id = new mongoose.Types.ObjectId(correctImageId);
    
            gfs.stream.find({ _id }).toArray((err, files) => {
                if (!files || files.length === 0) {
                    res.send({ message: 2 });
                } else {
                    gfs.stream.openDownloadStream(_id).pipe(res);
                };
            });
        } else {
            res.send({ message: 2 });
        }
    } catch (error) { 
        errorLogger.error(error);
        res.send({ message: 1 }); 
    }
});

export default router;