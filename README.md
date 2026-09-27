# AWS ECS Fargate Microservices

**AWS Solutions Architect - Associate Graduation Project — Project 6**

This repository contains the two mandatory submission items first, with optional implementation artifacts kept separate.

## 1. Solution Architecture Diagram

![Solution Architecture](01-architecture-diagram/architecture.svg)

The diagram is also available directly in the [architecture folder](01-architecture-diagram).

## 2. Project Documentation

### Objective

Migrate a monolithic Node.js application into three microservices — **Auth**, **Orders**, and **Notifications** — and run them on **Amazon ECS with AWS Fargate**.

### Architecture

- **Application Load Balancer** routes external traffic.
- **Auth Service**, **Orders Service**, and **Notifications Service** run as ECS Fargate services.
- **AWS Cloud Map** provides private service discovery.
- **Amazon ElastiCache for Redis** stores shared session data.
- **AWS Secrets Manager** supplies runtime secrets.
- **Amazon ECR** stores the container images.
- **AWS CodePipeline + CodeBuild + CodeDeploy** provide CI/CD with blue/green deployment.
- **AWS X-Ray** provides distributed tracing.

### Request flow

```text
Users
  |
  v
Application Load Balancer
  |----------------------|
  | /api/auth/*          | /api/orders/*
  v                      v
Auth Service         Orders Service
  |                      |
  v                      v
Redis               AWS Cloud Map
                         |
                         v
                 Notifications Service
```

### Microservices

**Auth Service**
- Handles authentication and session creation.
- Stores shared session state in Redis.

**Orders Service**
- Handles order requests.
- Uses Cloud Map to discover the Notifications service.

**Notifications Service**
- Receives internal notification requests.
- Is not exposed directly to the internet.

### CI/CD

```text
GitHub
  |
  v
CodePipeline
  |
  +--> CodeBuild --> Amazon ECR
  |
  +--> CodeDeploy --> ECS blue/green deployment
```

### Security and availability

- The ALB is the public entry point.
- ECS services are intended to run in private application subnets.
- Secrets are stored in AWS Secrets Manager rather than in source code.
- Container images are stored in private ECR repositories.
- IAM access should follow least privilege.
- ECS services can run multiple tasks across Availability Zones for high availability.

### Requirement mapping

| Project requirement | Design |
| --- | --- |
| Container orchestration | Amazon ECS with AWS Fargate |
| Private container registry | Amazon ECR |
| External traffic | Application Load Balancer |
| Service discovery | AWS Cloud Map |
| Runtime secrets | AWS Secrets Manager |
| Shared sessions | Amazon ElastiCache for Redis |
| CI/CD | AWS CodePipeline, CodeBuild, CodeDeploy |
| Deployment strategy | Blue/green |
| Distributed tracing | AWS X-Ray |

## Optional implementation artifacts

The folder [03-optional-demo](03-optional-demo) contains supporting source code, Docker Compose, Terraform, CI/CD templates, and operational notes.

These files are **optional supporting artifacts**. The repository does **not** claim that the full AWS environment is deployed, and no live URL, screenshots, or recorded demo are included.

## Repository structure

```text
.
├── README.md
├── 01-architecture-diagram/
│   ├── architecture.svg
│   └── README.md
├── 02-project-documentation/
│   └── README.md
└── 03-optional-demo/
    ├── README.md
    └── artifacts/
```

## Mandatory deliverables

1. **Solution Architecture Diagram** — `01-architecture-diagram/architecture.svg`
2. **Public GitHub repository with complete documentation in the README** — this repository and this README
