require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.SERVER_PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'fuel_3d_face_demo',
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES || 15,
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fuel_3d_face_demo',
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET_NAME,
  },
};

module.exports = config;
