import * as storage from '@google-cloud/storage';
import { format } from 'util';

const uploadFileToGCloud =  async(req,res, next): Promise<void> => {
    return new Promise((resolve, reject) => {
        const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const GOOGLE_CLOUD_KEYFILE = process.env.GOOGLE_CLOUD_KEYFILE;
        const BUCKET_NAME = process.env.GOOGLE_CLOUD_BUCKET_NAME;
        const client = new storage.Storage({
            projectId: GOOGLE_CLOUD_PROJECT_ID,
            keyFilename: GOOGLE_CLOUD_KEYFILE
        });
        const bucket = client.bucket(BUCKET_NAME);
        const gcsFileName = req.file.originalname;
        const file = bucket.file(gcsFileName);
    
        const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
        });
        stream.on('error', (err) => {
            req.file.cloudStorageError = err;
            next(err);
            reject(err);
            return res.status(500).send("Unable to upload")
        });
    
        stream.on('finish', () => {
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${file.name}`
            );
        return res.status(200).send(publicUrl);
        });

        stream.end(req.file.buffer);
        resolve()
    });
    
};
export default uploadFileToGCloud;

