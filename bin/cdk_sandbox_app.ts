#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { CdkSandboxApp } from "../lib/cdk_sandbox_app-stack.js";

const app = new cdk.App();
const { account = "407067881746", region = "us-east-1" } = {
  account: "407067881746", // Environment-specific configuration - Required for account/region-dependent features
  region: "us-east-1", // like VPC lookups, AZ availability, and proper CloudFormation stack policies.
};

new CdkSandboxApp(app, "CdkSandboxApp", { env: { account, region } });
