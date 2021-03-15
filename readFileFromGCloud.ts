import * as storage from '@google-cloud/storage';

const readFileFromGCloud = async (filename,res) => {
    const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const GOOGLE_CLOUD_KEYFILE = process.env.GOOGLE_CLOUD_KEYFILE;
    const BUCKET_NAME = process.env.GOOGLE_CLOUD_BUCKET_NAME;
    const client = new storage.Storage({
        projectId: GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: GOOGLE_CLOUD_KEYFILE
    });

    const remoteFile = client.bucket(BUCKET_NAME).file(filename).createReadStream();
    var  buf = '';
    remoteFile.on('data', function(d) {
        buf += d;
    }).on('end', function() {
        //console.log(buf);
        console.log("End");
        //return res.status(200).send(buf);
        return res.status(200).send("read successfully");
    }); 
};

export default readFileFromGCloud;