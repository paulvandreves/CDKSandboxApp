import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkSandboxApp extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //TODO: Set CDK.Removal policy to destroy

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkSandboxAppQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
