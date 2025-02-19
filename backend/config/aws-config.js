const AWS = require("aws-sdk");

AWS.config.update({region: "ap-south-1"});

const S3_BUCKET = "your-bucket-name";  // Replace with your bucket name
const s3 = new AWS.S3();

module.exports = { s3, S3_BUCKET };
