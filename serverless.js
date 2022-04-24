require('./environment');

const importDir = require('directory-import');
const camelCase = require('lodash/camelCase');

const consoleTableObject = require('./utils/console-table-object');
const setIfNotExists     = require('./utils/set-if-not-exists');

const {
  SERVERLESS_VERSION,
  NODE_ENGINE_VERSION,
  PROJECT_NAME,

  AWS_PROFILE,
  AWS_REGION,
  STACK_NAME,
  STAGE,

  IS_OFFLINE,
  IS_DEVELOPMENT,
} = process.env;

// Base configuration
(() => {
  const config = module.exports;

  config.service = PROJECT_NAME;

  config.frameworkVersion = SERVERLESS_VERSION;

  config.configValidationMode        = 'error';
  config.deprecationNotificationMode = 'error';

  config.plugins = [
    'serverless-s3-sync',
    'serverless-stack-output',
    'serverless-plugin-scripts',
    'serverless-deployment-bucket',
  ];

  consoleTableObject('⚡ Serverless base configuration:', config);
})();

// Provider configuration
(() => {
  const config = setIfNotExists(module.exports, 'provider', {}).provider;

  config.name    = 'aws';
  config.runtime = `nodejs${NODE_ENGINE_VERSION}`;

  config.stage     = STAGE;
  config.region    = AWS_REGION;
  config.stackName = STACK_NAME;

  config.profile         = IS_OFFLINE ? AWS_PROFILE : undefined;
  config.disableRollback = !!IS_DEVELOPMENT;

  config.logRetentionInDays = 7;

  config.versionFunctions = true;

  consoleTableObject('⚡ Serverless provider configuration:', config);
})();

// Deployment bucket configuration
(() => {
  const config = setIfNotExists(module.exports, 'provider.deploymentBucket', {}).provider.deploymentBucket;

  config.name = `${STACK_NAME}-deployment-bucket`;

  config.blockPublicAccess              = true;
  config.maxPreviousDeploymentArtifacts = 1;

  consoleTableObject('⚡ Serverless deployment bucket configuration:', config);
})();

// Stack output configuration
(() => {
  const config = setIfNotExists(module.exports, 'custom.output', {}).custom.output;

  config.file = '.serverless/stack-output.json';

  consoleTableObject('⚡ Serverless stack output Configuration:', config);
})();

// S3 sync Configuration
(() => {
  const config = setIfNotExists(module.exports, 'custom.s3Sync', {}).custom.s3Sync;

  config.bucketName = `${STACK_NAME}-app-bucket`;
  config.localDir   = 'web-application/dist';

  consoleTableObject('⚡ Serverless S3 sync Configuration:', config);
})();

// Resources configuration
(() => {
  const config = setIfNotExists(module.exports, 'resources.Resources', {}).resources.Resources;

  importDir({ directoryPath: './resources' }, (resourceName, resourcePath, resourceConfig) => {
    const resourceCamelCaseName = camelCase(resourceName);

    config[resourceCamelCaseName] = resourceConfig;
  });

  console.group('⚡', 'Serverless resources configuration:');
  console.table(config);
  console.groupEnd();
})();
