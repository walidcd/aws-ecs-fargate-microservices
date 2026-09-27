variable "aws_region" {
  description = "AWS Region used for the project."
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  type    = string
  default = "microservices"
}

variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for the public HTTPS listener."
  type        = string
}

variable "github_owner" {
  type    = string
  default = "walidcd"
}

variable "github_repo" {
  type    = string
  default = "aws-ecs-fargate-microservices"
}

variable "codestar_connection_arn" {
  description = "Existing CodeStar Connections ARN authorized for GitHub."
  type        = string
  default     = ""
}
