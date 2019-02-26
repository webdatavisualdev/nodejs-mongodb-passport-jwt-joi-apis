const jsyaml = require('js-yaml');
const config = require('../../config');
const { handler: errorHandler } = require('../middlewares/error');
const { listDirectory, faceObjectFiles, getObject } = require('../utils/S3Client');
const Analyze = require('../utils/Analyze');

exports.list = async (req, res, next) => {
  try {
    const s3Params = {
      Bucket: config.s3.bucket,
      MaxKeys: 20,
      Delimiter: '/',
      Prefix: 'fuel3d_demo_data/'
    };
    const data = await listDirectory(s3Params);
    const result = data.CommonPrefixes.map(item => {
      const folderName = item.Prefix.replace(data.Prefix, '').replace(/\/$/, '');
      const { path, thumbnail, name, id } = faceObjectFiles(folderName);
      return { id, name, url: path + thumbnail };
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.show = (req, res, next) => {
  const { faceId } = req.params;
  return res.json(faceObjectFiles(faceId));
};

exports.analyze = async (req, res, next) => {
  const { faceId } = req.params;
  try {
    const s3Params = {
      Bucket: config.s3.bucket,
      Key: `fuel3d_demo_data/${faceId}/Output_sd/faceLandmarks.obj.yml`,
    };
    const data = await getObject(s3Params);
    let body = data.Body.toString().replace(/!!opencv-matrix/gi, '');
    body = jsyaml.safeLoad(body);
    const analyze = new Analyze(body['Point3f']['data']);
    const match = analyze.similarityError();
    const similarity = analyze.checkSimilarity();
    return res.json({ match, similarity });
  } catch (error) {
    return next(error);
  }
};
