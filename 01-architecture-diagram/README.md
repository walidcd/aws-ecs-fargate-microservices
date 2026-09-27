# Solution Architecture Diagram

![AWS ECS Fargate Microservices Architecture](architecture.svg)

## Main flow

```text
Internet
   |
   v
Application Load Balancer
   |----------------------|
   v                      v
Auth Service          Orders Service
   |                      |
   |                      +---- Cloud Map ----> Notifications Service
   |
   +---- Redis

Auth / Orders ----> PostgreSQL
```

The ECS services run on **AWS Fargate in private subnets across two Availability Zones**. The ALB is the public entry point. AWS Cloud Map provides private DNS-based service discovery, Secrets Manager protects sensitive configuration, ECR stores container images, and CodePipeline/CodeDeploy support blue/green delivery. CloudWatch and X-Ray provide observability.
