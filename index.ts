import express from 'express';
import multer from 'multer';
import uploadFileToS3 from  './uploadToS3';
import uploadFileToGCloud from './uploadToGCloud'
import readFileFromGCloud from './readFileFromGCloud'
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;
const upload = multer();

app.get('/', (req, res) => {
    res.json({ message: 'hello wordl!' })
  })
app.post('/aws/aws', function (req, res) {
      res.send('POST request to the homepage');
    })
app.post('/gcp/gcp', function (req, res) {
      res.send('POST request to the homepage');
    })
  
// arm  compute GCP and S3
app.post('/gcp/aws', upload.single('filename'),async function (req, res, next) {
    await uploadFileToS3(req.file.originalname,req.file.buffer);
    res.send("Upload succesfully");
  })

// earth EC2 and g storage
app.post('/aws/gcp', upload.single('filename'),async function (req, res, next) {
  const filename = req.file.originalname
  return await uploadFileToGCloud(filename, req,res, next);
})

// earth EC2 and g storage
app.post('/aws/gcp/random', upload.single('filename'),async function (req, res, next) {
  var filename          = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()+=-_';
  var charactersLength = characters.length;
  for ( var i = 0; i < 10; i++ ) {
    filename += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return await uploadFileToGCloud(filename,req,res, next);
})

// read file from g storage
app.get('/read/aws/gcp/:filename',async function (req, res, next) {
  return await readFileFromGCloud(req.params.filename,res);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});