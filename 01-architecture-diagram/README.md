# Solution Architecture Diagram

![AWS ECS Fargate Microservices Architecture](architecture.svg)

This is the final architecture diagram for Project 6.

It shows the required runtime and delivery components:

- Application Load Balancer
- Amazon ECS on AWS Fargate
- Auth, Orders, and Notifications services
- AWS Cloud Map
- Amazon ElastiCache for Redis
- AWS Secrets Manager
- Amazon ECR
- AWS CodePipeline, CodeBuild, and CodeDeploy
- AWS X-Ray

The complete project explanation is kept in the [root README](../README.md) to avoid duplicate documentation.
