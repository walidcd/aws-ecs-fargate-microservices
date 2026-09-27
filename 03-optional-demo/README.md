# Optional Implementation / Demo Artifacts

This folder contains **supporting artifacts only**. They are intentionally separated from the two mandatory deliverables.

There is **no live deployment URL, recorded video, or screenshots** in this submission.

## Included artifacts

```text
03-optional-demo/
└── artifacts/
    ├── docker-compose.yml
    ├── database/
    ├── services/
    │   ├── auth-service/
    │   ├── orders-service/
    │   └── notifications-service/
    ├── cicd/
    ├── terraform/
    └── docs/
```

### Application artifacts

Three small Node.js services demonstrate the proposed decomposition:

- Auth
- Orders
- Notifications

### Local artifacts

Docker Compose provides PostgreSQL, Redis, and the three services for local experimentation.

### Infrastructure as Code

The Terraform files are a supporting reference implementation for:

- VPC and multi-AZ subnet layout;
- NAT gateways and routing;
- security groups;
- ECS/Fargate;
- ECR;
- ALB;
- Cloud Map;
- RDS;
- ElastiCache;
- Secrets Manager;
- CloudWatch;
- X-Ray;
- autoscaling;
- CodeBuild, CodePipeline, and CodeDeploy.

### CI/CD artifacts

The `cicd` folder contains reference CodeBuild and ECS CodeDeploy blue/green deployment files.

### Operational notes

The `docs` folder contains optional deployment, testing, security, cost, and cleanup guidance.

> These artifacts support the architecture documentation; they are not presented as evidence of a live AWS deployment.
