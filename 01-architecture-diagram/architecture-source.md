# Solution Architecture

```mermaid
flowchart TB
  U[Global Users] --> ALB[Application Load Balancer]

  subgraph VPC[AWS VPC - 2 Availability Zones]
    subgraph Public[Public Subnets]
      ALB
    end

    subgraph Private[Private Application Subnets]
      AUTH[ECS Fargate - Auth]
      ORD[ECS Fargate - Orders]
      NOTIF[ECS Fargate - Notifications]
    end

    subgraph Data[Private Data Subnets]
      RDS[(Amazon RDS PostgreSQL Multi-AZ)]
      REDIS[(Amazon ElastiCache Redis)]
    end
  end

  ALB -->|/api/auth/*| AUTH
  ALB -->|/api/orders/*| ORD
  ORD -->|Cloud Map DNS| NOTIF
  AUTH --> RDS
  AUTH --> REDIS
  ORD --> RDS

  SM[AWS Secrets Manager] --> AUTH
  SM --> ORD

  ECR[Amazon ECR] --> AUTH
  ECR --> ORD
  ECR --> NOTIF

  GH[GitHub] --> CP[CodePipeline]
  CP --> CB[CodeBuild]
  CB --> ECR
  CP --> CD[CodeDeploy Blue/Green]
  CD --> ALB

  AUTH --> CW[CloudWatch + X-Ray]
  ORD --> CW
  NOTIF --> CW
```

## Network boundaries

The ALB is the only internet-facing component. ECS tasks, RDS, and Redis are deployed in private subnets. Security groups allow only the minimum required flows.
