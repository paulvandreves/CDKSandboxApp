# CDK Sandbox App — Claude Context

## Project Overview

**Purpose:** AWS CDK TypeScript project for learning infrastructure as code and AWS services. Used for studying AWS Certified Developer – Associate exam topics.
**Technology Stack:**

- AWS CDK v2.260.0
- TypeScript 5.9.3
- Node.js 24.x (Lambda runtime)

- All resources use `RemovalPolicy.DESTROY` for cost-effective cleanup

## Code Style & Standards

All code changes must follow these principles:

### 1. **Concise & Simple & declarative **

```typescript
// ✅ Good: Direct, clear intent
const { queue } = this.createSqsQueue();

// ❌ Avoid: Unnecessary wrapper
const queueResult = this.createSqsQueueWithErrorHandling();
```

### 2. **DRY (Don't Repeat Yourself)**

- Extract common patterns into private methods
- Use ES6 destructuring and spread syntax to reduce the lines of code
- Compose functions for reusable logic

```typescript
// ✅ Good: Reusable private method
private createSqsQueue() {
  const queue = new sqs.Queue(this, "lambda-demo-sqs", {
    visibilityTimeout: cdk.Duration.seconds(300),
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });
  return { queue };
}

// ✅ Good: Destructuring in constructor
const { account = "407067881746", region = "us-east-1" } = {
  account: "407067881746",
  region: "us-east-1",
};
```

### 3. **Composable & Declarative**

- Structure code with clear, chainable operations
- Express intent through method names (verbose, descriptive names)
- Avoid imperative flow control where possible
- Self-documenting through naming

```typescript
// ✅ Good: Composable, declarative structure
const { queue } = this.createSqsQueue();
const { lambdaFunction } = this.createSqsLambda();
this.connectQueueToLambda(queue, lambdaFunction);

// ✅ Good: Method names describe intent
private createSqsQueue() { ... }
private createSqsLambda() { ... }
private connectQueueToLambda() { ... }
```

### 4. **Self-Commenting Code**

- Use clear, descriptive variable and function names
- Names should explain the "what" without comments
- Only comment the "why" when non-obvious

```typescript
// ✅ Good: Name explains intent
const visibilityTimeout = cdk.Duration.seconds(300);
const batchSize = 10;

// ❌ Avoid: Name requires comment explanation
const vt = cdk.Duration.seconds(300); // visibility timeout
const bs = 10; // batch size
```

### 5. **AWS Certified Developer – Associate Exam Comments**

Include comments that highlight exam-relevant concepts:

```typescript
// Event Source Mapping: Configures Lambda to be triggered by SQS events
// Lambda polls the queue, deserializes messages, and invokes the function
// Important for AWS Developer exam: EventSourceMapping is polling-based (not push-based like SNS)

// RemovalPolicy.DESTROY: Deletes resource when stack is destroyed
// Use for test resources to avoid incurring costs

// Lambda IAM Permissions: CDK automatically grants required SQS permissions
// Includes: sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes

// SQS Visibility Timeout: Time message is hidden from other consumers after being read
// Configure based on Lambda processing time to avoid message duplication
```

---

## Development Workflow

### 1. **Before Making Changes**

```bash
npm run pre-deploy
```

This runs all checks in sequence:

- **lint:fix** — Auto-fix ESLint issues
- **lint** — Verify code complies with linting standards
- **format** — Apply Prettier formatting
- **build** — Compile TypeScript
- **cdk validate** — Validate CloudFormation template

All checks must pass before deployment.

### 2. **After Making Changes**

```bash
# Run pre-deploy to verify everything is correct
npm run pre-deploy
# Review what will be deployed
npm run cdk diff
# Ask user to deploy to AWS
```

### 3. **Useful Commands**

**Validation & Inspection:**

```bash
npm run cdk validate -- --unstable=validate  # Validate CloudFormation
npm run cdk diff                              # Show deployment changes
npm run cdk list                              # List all stacks
npm run cdk diagnose -- --unstable=diagnose  # Debug CDK issues
```

**Development:**

```bash
npm run build                  # Compile TypeScript
npm run watch                  # Watch and recompile on changes
npm run lint                   # Check code quality
npm run lint:fix               # Auto-fix linting issues
npm run format                 # Format with Prettier
npm run format:check           # Check formatting without changes
```

**Deployment:**

```bash
npm run cdk synth              # Generate CloudFormation template
npm run cdk deploy             # Deploy to AWS
npm run cdk destroy --force    # Destroy deployed resources
```

---

## Project Structure

```
CDKSandboxApp/
├── bin/
│   └── cdk_sandbox_app.ts              # Entry point (creates App, instantiates stack)
├── lib/
│   └── cdk_sandbox_app-stack.ts        # Stack definition (resources)
├── package.json                         # Dependencies, scripts
├── tsconfig.json                        # TypeScript configuration
├── eslint.config.js                     # ESLint rules
├── .prettierrc.json                     # Prettier formatting
├── cdk.json                             # CDK configuration
└── README.md                            # Deployment commands & CDK concepts
```

---

## Key Patterns Used

### 1. **Private Composable Methods**

Split stack construction into focused methods for clarity:

```typescript
constructor(scope: Construct, id: string, props?: cdk.StackProps) {
  super(scope, id, props);

  const { queue } = this.createSqsQueue();
  const { lambdaFunction } = this.createSqsLambda();
  this.connectQueueToLambda(queue, lambdaFunction);
}

private createSqsQueue() { ... }
private createSqsLambda() { ... }
private connectQueueToLambda() { ... }
```

### 2. **Destructuring Return Values**

Always return objects from private methods:

```typescript
private createSqsQueue() {
  const queue = new sqs.Queue(...);
  return { queue };
}

// Usage
const { queue } = this.createSqsQueue();
```

### 3. **ES6 Syntax**

- Use arrow functions for callbacks
- Use const/let (never var)
- Use destructuring for parameters and imports
- Use spread/rest operators
- Use implicit return when possible
- avoid arrow parens

```typescript
// ✅ Good
import { Construct } from "constructs";
const { queue } = this.createSqsQueue();
const handler = (event) => { ... };

// ❌ Avoid
var queue = this.createSqsQueue();
function handler(event) { ... }
```

### 4. **Promise.catch Over Try-Catch**

Use Promise.catch for async operations:

```typescript
// ✅ Good: Promise chain with .catch()
lambdaFunction.addEventSource(eventSource).catch(error => {
  console.error("Failed to add event source:", error);
});

// ❌ Avoid: Try-catch for Promise-based operations
try {
  await lambdaFunction.addEventSource(eventSource);
} catch (error) {
  // ...
}
```

## Important Notes

1. **RemovalPolicy.DESTROY** is set on all resources — they will be deleted when the stack is destroyed.

2. **Cost Management** — Destroy resources when not in use: this is for learning, all resources should be easy to destroy to avoid incurring costs

   ```bash
   npm run cdk destroy --force
   ```

3. **No Breaking Changes** — When modifying infrastructure, ensure `npm run pre-deploy` passes before asking user to review and deploy changes

## References

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/)
- [AWS Certified Developer – Associate Exam Guide](https://aws.amazon.com/certification/certified-developer-associate/)
- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/latest/)
- [SQS Best Practices](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/best-practices.html)
- [Lambda Event Source Mappings](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html)
