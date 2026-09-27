# Testing and Validation

## Local functional test

Start the stack:

```bash
docker compose up --build
```

Register:

```bash
curl -i -X POST http://localhost:8081/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","password":"Passw0rd!"}'
```

Login and copy the returned token:

```bash
curl -s -X POST http://localhost:8081/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","password":"Passw0rd!"}'
```

Create an order:

```bash
curl -i -X POST http://localhost:8082/api/orders \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN>' \
  -d '{"item":"Architecture Review","quantity":1}'
```

Expected result: HTTP 201 from Orders and a JSON `notification_received` entry in the Notifications container logs.

## AWS validation checklist

1. ALB target groups show healthy Auth and Orders targets.
2. ECS services keep desired count >= 2.
3. Tasks are spread across both Availability Zones.
4. RDS is not publicly accessible.
5. Redis is reachable only from ECS.
6. `notifications.microservices.local` resolves from an ECS task.
7. ECR repositories show image scan results.
8. CloudWatch receives one log stream per running task.
9. Scaling test increases task count when average CPU exceeds the target.
10. A failed green deployment rolls back to the blue task set.

## Failure scenarios

### ECS task failure
ECS replaces the failed task while the ALB sends traffic only to healthy targets.

### Availability Zone failure
The ALB and ECS service continue serving from the second AZ.

### Database instance failure
RDS Multi-AZ performs managed failover.

### Redis node failure
ElastiCache Multi-AZ automatic failover promotes the replica.

### Bad deployment
CodeDeploy blue/green keeps the previous task set available and automatically rolls back on deployment failure.
