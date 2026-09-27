# Optional Supporting Artifacts

This folder contains supporting implementation artifacts only. It is separate from the mandatory submission.

## Included

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

The artifacts include sample Node.js microservices, local Docker Compose configuration, Terraform infrastructure, CI/CD templates, and operational notes.

They are provided as supporting implementation material only. This repository does **not** claim that the full AWS environment is deployed.

## Placeholders

Infrastructure and CI/CD templates may contain account- or deployment-specific placeholders such as `REPLACE_ME`, `<TASK_DEFINITION>`, `<AWS_REGION>`, or ARNs.

They only need to be replaced if the optional implementation is actually deployed.
