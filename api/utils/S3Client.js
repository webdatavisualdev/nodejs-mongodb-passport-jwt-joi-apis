const S3 = require('aws-sdk/clients/s3');
const config = require('../../config');

const S3Client = new S3({
  secretAccessKey: config.s3.secretAccessKey,
  accessKeyId: config.s3.accessKeyId,
  region: config.s3.region,
  httpOptions: {
    timeout: 6000,
    agent: false,
  },
});

const userNames = ['Alex', 'Arun', 'Farhad', 'Phillip'];

exports.faceObjectFiles = (folderName) => {
  let name;
  userNames.forEach((username) => {
    if(folderName.toLowerCase().indexOf(username.toLowerCase()) > -1) {
      name = username;
    }
  });
  return {
    path: `//s3-${config.s3.region}.amazonaws.com/${config.s3.bucket}/fuel3d_demo_data/${folderName}/Output_sd/`,
    thumbnail: 'C_00001.jpg',
    img: 'head3d.jpg',
    obj: 'head3d.obj',
    mtl: 'head3d.obj.mtl',
    points: 'faceLandmarks.obj.yml',
    id: folderName,
    name,
  };
};

exports.listDirectory = params => {
  return new Promise ((resolve, reject) => {
    S3Client.listObjectsV2(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

exports.getObject = params => {
  return new Promise ((resolve, reject) => {
    S3Client.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
