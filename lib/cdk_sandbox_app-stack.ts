import * as cdk from "aws-cdk-lib/core";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";

export class CdkSandboxApp extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { queue } = this.createSqsQueue(); // Important for AWS Developer exam: Understanding when to use SQS vs SNS vs EventBridge
    const { lambdaFunction } = this.createSqsLambda(); // The Lambda service polls the queue, deserializes messages, and invokes the function
    // Event Source Mapping: Establishes the relationship between Lambda and SQS
    this.connectQueueToLambda(queue, lambdaFunction); // Lambda polls the queue with BatchWindow and BatchSize configurations
  } // Failed messages can be sent to DLQ (important for error handling)

  private createSqsQueue() {
    const queue = new sqs.Queue(this, "LambdaDemoSqs", {
      visibilityTimeout: cdk.Duration.seconds(300),
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Cleanup test resources to avoid AWS costs
    });
    return { queue };
  }
  private createSqsLambda() {
    const lambdaFunction = new lambda.Function(this, "LambdaSqs", {
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Processing SQS message:', JSON.stringify(event, null, 2));
          return { statusCode: 200, body: 'Processed' };
        };
      `),
    });
    return { lambdaFunction };
  }
  private connectQueueToLambda(queue: sqs.Queue, lambdaFunction: lambda.Function) {
    // EventSourceMapping: Configures Lambda to be triggered by SQS events
    // CDK automatically handles IAM permissions for Lambda to read from SQS
    lambdaFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(queue, {
        batchSize: 10, // Number of messages in a single batch
        reportBatchItemFailures: true, // Enable partial batch failure handling
      }),
    );
    return { lambdaFunction, queue };
  }
}
