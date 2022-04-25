const { STACK_NAME } = process.env;

module.exports = {
  Type: 'AWS::CloudFront::Distribution',

  Properties: {
    DistributionConfig: {
      Enabled: true,

      DefaultRootObject: 'index.html',

      Origins: [{
        DomainName: { 'Fn::GetAtt': ['s3BucketWebApplication', 'DomainName'] },
        Id:         `${STACK_NAME}-app`,

        CustomOriginConfig: {
          HTTPPort:  80,
          HTTPSPort: 443,

          OriginProtocolPolicy: 'https-only',
        },
      }],

      CustomErrorResponses: [{
        ErrorCode:    404,
        ResponseCode: 200,

        ResponsePagePath: '/error.html',
      }],

      DefaultCacheBehavior: {
        TargetOriginId:       `${STACK_NAME}-app`,
        ViewerProtocolPolicy: 'redirect-to-https',

        AllowedMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],

        ForwardedValues: {
          QueryString: 'false',

          Cookies: {
            Forward: 'none',
          },
        },
      },

      ViewerCertificate: {
        CloudFrontDefaultCertificate: true,
      },

      Comment: 'Web application for simple secrets telegram bot',
    },
  },
};
