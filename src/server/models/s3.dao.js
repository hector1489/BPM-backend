const { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

// Configuración de AWS S3
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Función para listar todas las fotos en un bucket de S3
const listPhotos = async () => {
  const params = {
    Bucket: BUCKET_NAME,
  };

  try {
    const data = await s3.send(new ListObjectsV2Command(params));

    // Generar presigned URLs para cada foto
    const photos = await Promise.all(
      data.Contents.map(async (item) => {
        const url = await getSignedUrl(s3, new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key,
        }), { expiresIn: 3600 }); // URL expira en 1 hora (3600 segundos)
        return {
          key: item.Key,
          url,
        };
      })
    );

    return photos;
  } catch (error) {
    throw new Error(`Error al listar las fotos: ${error.message}`);
  }
};

// Función para subir una foto a S3
const uploadPhoto = async (file) => {
  const key = `photos/${uuidv4()}_${file.originalname}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));

    // Generar una URL firmada para la foto subida
    const url = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }), { expiresIn: 3600 }); // URL expira en 1 hora (3600 segundos)

    return {
      key,
      url,
    };
  } catch (error) {
    throw new Error(`Error al subir la foto: ${error.message}`);
  }
};

// Función para recuperar una foto de S3 por su clave
const getPhoto = async (key) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  try {
    // Generar una URL firmada para la foto solicitada
    const url = await getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: 3600 });

    return {
      key,
      url,
    };
  } catch (error) {
    throw new Error(`Error al obtener la foto: ${error.message}`);
  }
};

module.exports = {
  listPhotos,
  uploadPhoto,
  getPhoto
};
