# Cost and Cleanup

## Main cost drivers

The architecture is intentionally production-oriented. The largest recurring costs in a small lab are typically:

1. Two NAT gateways
2. Multi-AZ RDS
3. Two-node ElastiCache replication group
4. Always-running Fargate tasks
5. Application Load Balancer

For a short demonstration, deploy only long enough to validate the architecture.

## Why the design still uses these resources

The graduation project demonstrates high availability. Removing the second AZ, Multi-AZ database, Redis replica, or redundant NAT path would reduce cost but weaken the architectural requirement.

## Cost optimization options

For a non-production lab:

- Reduce ECS desired counts temporarily.
- Use the smallest supported RDS and Redis instance classes.
- Keep CloudWatch log retention short.
- Destroy the environment immediately after screenshots/demo.
- In a production evolution, add VPC endpoints to reduce NAT data-processing charges.

## Cleanup

From the Terraform directory:

```bash
terraform destroy
```

Then verify there are no residual billable resources such as:

- NAT gateways and Elastic IPs
- RDS instances/snapshots
- ElastiCache clusters
- ALBs
- ECS services/tasks
- ECR images
- CloudWatch log groups
- S3 pipeline artifact buckets

The Terraform configuration sets the lab database to skip the final snapshot so cleanup can complete without manual intervention. For production, use final snapshots and deletion protection.
