output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "ecr_repositories" {
  value = { for name, repo in aws_ecr_repository.service : name => repo.repository_url }
}

output "cloud_map_notifications" {
  value = "notifications.microservices.local"
}

output "rds_endpoint" {
  value     = aws_db_instance.postgres.address
  sensitive = true
}
