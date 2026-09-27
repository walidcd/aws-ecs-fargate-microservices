# Deployment Guide

## 1. Prerequisites

- AWS account
- AWS CLI authenticated
- Terraform >= 1.6
- Docker
- An ACM certificate in the target Region
- A GitHub CodeStar Connection if you want CodePipeline source integration

## 2. Validate locally

```bash
docker compose up --build
```

Check all health endpoints:

```bash
curl http://localhost:8081/health
curl http://localhost:8082/health
curl http://localhost:8083/health
```

## 3. Deploy AWS infrastructure

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit certificate_arn and, optionally, codestar_connection_arn.
terraform init
terraform fmt -check
terraform validate
terraform plan
terraform apply
```

## 4. Build and push initial images

Terraform creates three ECR repositories. Authenticate Docker:

```bash
AWS_REGION=eu-west-3
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region "$AWS_REGION" |
  docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
```

Build and push:

```bash
for service in auth orders notifications; do
  docker build -t "microservices-$service" "../../services/$service-service"
  docker tag "microservices-$service:latest"     "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/microservices-$service:latest"
  docker push "$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/microservices-$service:latest"
done
```

Force the services to pick up initial images after pushing if needed.

## 5. Database schema

For a real deployment, run `database/init.sql` against the private RDS instance from an approved migration runner inside the VPC. Do not expose RDS publicly just to initialize it.

## 6. CI/CD

The repository contains:

- `cicd/buildspec.yml`
- `cicd/appspec.yaml`
- `cicd/taskdef.json`

CodeBuild builds all images and pushes them to ECR. The Terraform configuration creates the CodeBuild project and optionally the GitHub-source CodePipeline when a CodeStar connection ARN is supplied.

The Orders ECS service uses the CodeDeploy deployment controller and a blue/green target group pair. The supplied AppSpec/task-definition templates are the artifacts required by the ECS blue/green deployment action.

## 7. HTTPS

The public ALB exposes HTTPS only. The ACM certificate ARN is supplied as a Terraform variable.

## 8. Production hardening

Before a production deployment:

- Enable AWS WAF on the ALB.
- Add VPC endpoints for ECR, CloudWatch Logs, Secrets Manager, and S3 to reduce NAT dependency.
- Enable Secrets Manager automatic rotation.
- Add RDS deletion protection.
- Add CloudWatch alarms to SNS.
- Add automated database migrations to the deployment pipeline.
