/**
 * Ambiente: staging
 * Instâncias menores + sem Multi-AZ + sem read replica
 */

terraform {
  required_version = ">= 1.9"

  backend "s3" {
    bucket         = "consorciopro-terraform-state"
    key            = "staging/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "consorciopro-terraform-locks"
  }

  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags { tags = { Project = "consorciopro", Environment = "staging" } }
}

locals {
  project     = "consorciopro"
  environment = "staging"
  azs         = ["us-east-1a", "us-east-1b"]
}

module "vpc" {
  source      = "../../modules/vpc"
  project     = local.project
  environment = local.environment
  vpc_cidr    = "10.1.0.0/16"
  azs         = local.azs
}

module "rds" {
  source      = "../../modules/rds"
  project     = local.project
  environment = local.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids

  instance_class    = "db.t3.small"
  allocated_storage = 50

  db_username = "consorcio"
  db_password = var.db_password

  allowed_cidr_blocks = ["10.1.0.0/16"]
}

module "eks" {
  source      = "../../modules/eks"
  project     = local.project
  environment = local.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids
}

output "rds_endpoint"     { value = module.rds.endpoint }
output "eks_cluster_name" { value = module.eks.cluster_name }

variable "db_password" { type = string, sensitive = true }
