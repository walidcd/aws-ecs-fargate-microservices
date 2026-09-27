# AWS ECS Fargate Microservices

**AWS Solutions Architect - Associate Graduation Project — Project 6**

This repository is intentionally organized around the **two mandatory Manara deliverables**, with all implementation material kept separately as optional supporting artifacts.

## Submission structure

### 1. Mandatory — Solution Architecture Diagram

📁 [01-architecture-diagram](01-architecture-diagram)

Contains the final AWS architecture diagram and a short explanation of the request flow.

### 2. Mandatory — Project Documentation

📁 [02-project-documentation](02-project-documentation)

Contains the complete project documentation for the selected architecture: containerized microservices on Amazon ECS Fargate with service discovery, security, scaling, CI/CD, and observability.

### 3. Optional — Implementation / Demo Artifacts

📁 [03-optional-demo](03-optional-demo)

Contains supporting technical artifacts only: sample microservices, Docker Compose, database schema, Terraform infrastructure, CodeBuild/CodeDeploy files, deployment notes, security notes, and testing guidance.

No live URL, screenshots, or recorded demo are included because those are optional.

---

## Project summary

The solution migrates a monolithic application into three microservices:

- **Auth**
- **Orders**
- **Notifications**

The target AWS architecture uses:

- Amazon ECS with AWS Fargate
- Amazon ECR
- Application Load Balancer
- AWS Cloud Map
- AWS Secrets Manager
- Amazon ElastiCache for Redis
- AWS CodePipeline, CodeBuild, and CodeDeploy
- Amazon CloudWatch and AWS X-Ray

The architecture is designed for high availability across two Availability Zones while minimizing server-management overhead.

> The mandatory submission is contained in folders **01** and **02**. Folder **03** is supporting material and is not required to understand the proposed architecture.
