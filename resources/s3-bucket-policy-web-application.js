const s3BucketWebApplicationArn = { 'Fn::GetAtt': ['s3BucketWebApplication', 'Arn'] };

module.exports = {
  Type: 'AWS::S3::BucketPolicy',

  Properties: {
    Bucket: { Ref: 's3BucketWebApplication' },

    PolicyDocument: {
      Version: '2012-10-17',

      Statement: [{
        Sid:       'PublicReadGetObject',
        Action:    ['s3:GetObject'],
        Effect:    'Allow',
        Principal: '*',

        Resource: [
          s3BucketWebApplicationArn,
          { 'Fn::Join': ['', [s3BucketWebApplicationArn, '/*']] },
        ],
      }],
    },
  },
};
