/**
 * Ambiente: production
 * Região: us-east-1
 */

terraform {
  required_version = ">= 1.9"

  backend "s3" {
    bucket         = "consorciopro-terraform-state"
    key            = "production/terraform.tfstate"
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
  default_tags { tags = { Project = "consorciopro", Environment = "production" } }
}

locals {
  project     = "consorciopro"
  environment = "production"
  azs         = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

# ─── VPC ─────────────────────────────────────────────────────────────────────
module "vpc" {
  source      = "../../modules/vpc"
  project     = local.project
  environment = local.environment
  vpc_cidr    = "10.0.0.0/16"
  azs         = local.azs
}

# ─── RDS ─────────────────────────────────────────────────────────────────────
module "rds" {
  source      = "../../modules/rds"
  project     = local.project
  environment = local.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids

  instance_class    = "db.r6g.large"
  allocated_storage = 500

  db_username = var.db_username
  db_password = var.db_password

  allowed_cidr_blocks = ["10.0.0.0/16"]
}

# ─── EKS ─────────────────────────────────────────────────────────────────────
module "eks" {
  source      = "../../modules/eks"
  project     = local.project
  environment = local.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids
}

# ─── Outputs ─────────────────────────────────────────────────────────────────
output "rds_endpoint"     { value = module.rds.endpoint }
output "eks_cluster_name" { value = module.eks.cluster_name }
output "vpc_id"           { value = module.vpc.vpc_id }

# ─── Variáveis ────────────────────────────────────────────────────────────────
variable "db_username" { type = string, default = "consorcio" }
variable "db_password" { type = string, sensitive = true }
