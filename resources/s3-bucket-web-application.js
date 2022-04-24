const { STACK_NAME } = process.env;

module.exports = {
  Type: 'AWS::S3::Bucket',

  Properties: {
    BucketName:    `${STACK_NAME}-app-bucket`,
    AccessControl: 'PublicRead',

    WebsiteConfiguration: {
      IndexDocument: 'index.html',
      ErrorDocument: 'error.html',
    },
  },
};
