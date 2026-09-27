# Project Documentation

## Project 6 — Containerized Microservices with ECS Fargate and Service Discovery

## 1. Objective

The goal is to migrate a monolithic application into three independently deployable microservices — **Auth**, **Orders**, and **Notifications** — and run them on AWS using Amazon ECS with AWS Fargate.

The design focuses on:

- container orchestration without managing EC2 hosts;
- high availability across multiple Availability Zones;
- path-based routing for public APIs;
- private service-to-service discovery;
- centralized secret management;
- shared session caching;
- automated blue/green deployments;
- centralized logging and distributed tracing.

## 2. Application decomposition

### Auth Service

Responsibilities:

- user registration and login;
- session creation and validation;
- session storage in Redis.

The service remains stateless because session state is stored outside the ECS task.

### Orders Service

Responsibilities:

- create and retrieve orders;
- validate authenticated sessions;
- persist order data;
- call the Notifications service after an order is created.

### Notifications Service

Responsibilities:

- receive internal notification requests;
- represent asynchronous or downstream notification processing.

The service is not exposed directly to the internet.

## 3. AWS architecture

The final architecture is shown in:

[../01-architecture-diagram/architecture.svg](../01-architecture-diagram/architecture.svg)

### Network layout

The VPC spans **two Availability Zones**.

- **Public subnets** contain the internet-facing Application Load Balancer.
- **Private application subnets** contain the ECS Fargate tasks.
- **Private data subnets** contain the database and Redis layer.

Only the Application Load Balancer is internet-facing.

## 4. Amazon ECS with AWS Fargate

Each microservice is packaged as its own Docker image and runs as a separate ECS service.

Fargate is used because it removes the need to provision, patch, or scale EC2 worker nodes. Each service can scale independently based on demand.

A production-oriented configuration keeps at least two tasks for externally used services so tasks can run across both Availability Zones.

## 5. Amazon ECR

Each service has its own private ECR repository:

- auth image;
- orders image;
- notifications image.

Image scanning on push is enabled in the supporting infrastructure design.

## 6. Application Load Balancer

The Application Load Balancer provides Layer 7 routing.

Example routing rules:

```text
/api/auth/*    -> Auth ECS service
/api/orders/*  -> Orders ECS service
```

The Notifications service does not need a public route.

## 7. AWS Cloud Map service discovery

The Orders service discovers the Notifications service through a private Cloud Map DNS namespace.

Example:

```text
notifications.microservices.local
```

This avoids hardcoding task IP addresses. ECS can replace or scale tasks while clients continue using the same service name.

## 8. AWS Secrets Manager

Sensitive values such as database credentials must not be stored in source code or container images.

AWS Secrets Manager is used to store sensitive configuration and make it available to ECS tasks at runtime through IAM-controlled access.

## 9. ElastiCache for Redis

Amazon ElastiCache for Redis is used as a shared session store.

This allows multiple Auth tasks to serve the same users without keeping session state inside individual containers, which supports horizontal scaling.

## 10. Data persistence

The project uses PostgreSQL as a supporting design choice for user and order persistence.

The database is placed in private data subnets and is not publicly reachable. A Multi-AZ configuration can be used for production-style availability.

## 11. High availability and scaling

The design uses:

- two Availability Zones;
- an ALB spanning public subnets in both AZs;
- ECS tasks running in private subnets;
- multiple ECS tasks per service where needed;
- ECS Service Auto Scaling;
- Multi-AZ database design;
- Redis replication/failover design.

Target tracking can scale ECS services based on average CPU utilization or another suitable CloudWatch metric.

## 12. Blue/green deployment

The deployment design follows:

```text
GitHub
   |
   v
CodePipeline
   |
   v
CodeBuild
   |
   v
Amazon ECR
   |
   v
CodeDeploy
   |
   v
ECS blue / green task sets
```

CodeDeploy can direct production traffic between blue and green ECS task sets through ALB target groups and automatically roll back if a deployment fails.

## 13. Observability

### CloudWatch

CloudWatch is used for:

- ECS application logs;
- container and service metrics;
- ALB health metrics;
- alarms.

### AWS X-Ray

X-Ray provides distributed tracing across the microservices so a request can be followed through multiple services.

Example flow:

```text
Client -> ALB -> Orders -> Notifications
```

## 14. Security design

The main controls are:

- public access terminates at the ALB;
- ECS tasks stay in private subnets;
- RDS and Redis stay in private data subnets;
- security groups restrict traffic between tiers;
- secrets are stored in Secrets Manager;
- ECS task roles follow least privilege;
- TLS is used at the public entry point;
- ECR image scanning is enabled;
- logs are centralized in CloudWatch.

## 15. Request example

A simplified order flow is:

```text
1. User authenticates through /api/auth/login
2. Auth creates a shared Redis session
3. User calls /api/orders with the session token
4. Orders validates the session
5. Orders writes the order to PostgreSQL
6. Orders resolves Notifications through Cloud Map
7. Notifications processes the internal request
8. Logs and traces are sent to CloudWatch / X-Ray
```

## 16. Why this architecture

This design meets the project goals because it:

- uses ECS Fargate to avoid server management;
- separates the application into independently scalable services;
- uses ALB path-based routing for public traffic;
- uses Cloud Map for private service discovery;
- uses Secrets Manager instead of hardcoded credentials;
- uses Redis to keep services stateless;
- supports blue/green deployments through CodeDeploy;
- provides centralized logs and distributed tracing.

## 17. Deliverables

The submission contains:

1. **Solution Architecture Diagram** — folder `01-architecture-diagram`.
2. **Complete Project Documentation** — this document and the root README.

Optional implementation artifacts are separated into `03-optional-demo` so the mandatory submission remains easy to review.
