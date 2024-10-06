const { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const listPDFs = async () => {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: 'pdfs/',
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(params));

    const pdfs = await Promise.all(
      data.Contents.map(async (item) => {
        const url = await getSignedUrl(s3, new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key,
        }), { expiresIn: 3600 });
        return {
          key: item.Key,
          url,
        };
      })
    );

    return pdfs;
  } catch (error) {
    throw new Error(`Error al listar los PDFs: ${error.message}`);
  }
};

const uploadPDF = async (file) => {
  const key = `pdfs/${uuidv4()}_${file.originalname}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));

    const url = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }), { expiresIn: 3600 });

    return {
      key,
      url,
    };
  } catch (error) {
    throw new Error(`Error al subir el PDF: ${error.message}`);
  }
};


const getPDF = async (key) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {

    const url = await getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: 3600 });

    return {
      key,
      url,
    };
  } catch (error) {
    throw new Error(`Error al obtener el PDF: ${error.message}`);
  }
};

const deletePDF = async (key) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
    console.log('PDF eliminado del bucket:', key);
    return { message: 'PDF eliminado correctamente', key };
  } catch (error) {
    console.error(`Error al eliminar el PDF con key: ${key}`, error.message);
    throw new Error(`Error al eliminar el PDF: ${error.message}`);
  }
};

module.exports = {
  listPDFs,
  uploadPDF,
  getPDF,
  deletePDF
};
