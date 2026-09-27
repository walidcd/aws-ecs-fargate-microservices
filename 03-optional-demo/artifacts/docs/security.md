# Security Design

## Network isolation

The VPC is split into three logical tiers across two Availability Zones:

- **Public subnets**: Application Load Balancer and NAT gateways.
- **Private application subnets**: ECS Fargate tasks.
- **Private data subnets**: RDS PostgreSQL and ElastiCache Redis.

RDS and Redis have no public route and accept traffic only from the ECS security group.

## Security groups

- ALB SG: inbound TCP/443 from the internet.
- ECS SG: inbound service ports from the ALB; service-to-service traffic is allowed only within the ECS SG.
- RDS SG: inbound TCP/5432 only from ECS.
- Redis SG: inbound TCP/6379 only from ECS.

## Secrets

Database credentials are generated during deployment and stored in AWS Secrets Manager. They are not committed to GitHub or baked into Docker images.

For a production implementation, prefer ECS secret injection rather than plain task-definition environment values, and enable automatic credential rotation.

## IAM

Separate IAM roles are used for:

- ECS task execution
- ECS application tasks
- CodeBuild
- CodePipeline
- CodeDeploy

The application task role intentionally has no broad AWS permissions.

## Encryption

- RDS storage encryption enabled.
- ElastiCache encryption at rest and in transit enabled.
- Pipeline artifact bucket encrypted.
- HTTPS terminates at the ALB.

## Container security

ECR scan-on-push is enabled for all repositories. Containers run as the non-root `node` user.

## Audit and monitoring

Recommended account-level controls:

- CloudTrail in all Regions
- AWS Config
- GuardDuty
- Security Hub
- CloudWatch alarms and log retention

These services are intentionally documented rather than provisioned by the lab Terraform because they are normally account-level controls, not application-specific resources.
