/**
 * Módulo RDS — PostgreSQL 16, Multi-AZ
 * Backup automático, criptografia, parameter group otimizado
 */

variable "project"            { type = string }
variable "environment"        { type = string }
variable "vpc_id"             { type = string }
variable "subnet_ids"         { type = list(string) }
variable "instance_class"     { type = string, default = "db.t3.medium" }
variable "allocated_storage"  { type = number, default = 100 }
variable "db_name"            { type = string, default = "consorcio_db" }
variable "db_username"        { type = string }
variable "db_password"        { type = string, sensitive = true }
variable "allowed_cidr_blocks" { type = list(string) }

locals {
  name = "${var.project}-${var.environment}-postgres"
  tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ─── Security Group ───────────────────────────────────────────────────────────
resource "aws_security_group" "rds" {
  name        = "${local.name}-sg"
  description = "Acesso ao RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
    description = "PostgreSQL from EKS nodes"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

# ─── Subnet Group ─────────────────────────────────────────────────────────────
resource "aws_db_subnet_group" "main" {
  name       = "${local.name}-subnet-group"
  subnet_ids = var.subnet_ids
  tags       = local.tags
}

# ─── Parameter Group (PostgreSQL otimizado) ───────────────────────────────────
resource "aws_db_parameter_group" "main" {
  family = "postgres16"
  name   = "${local.name}-params"

  parameter { name = "log_connections";        value = "1" }
  parameter { name = "log_disconnections";     value = "1" }
  parameter { name = "log_lock_waits";         value = "1" }
  parameter { name = "log_min_duration_statement"; value = "1000" }  # log queries > 1s
  parameter { name = "shared_preload_libraries";   value = "pg_stat_statements" }
  parameter { name = "max_connections";        value = "200" }

  tags = local.tags
}

# ─── RDS Instance ─────────────────────────────────────────────────────────────
resource "aws_db_instance" "main" {
  identifier = local.name

  engine         = "postgres"
  engine_version = "16.3"
  instance_class = var.instance_class

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.allocated_storage * 3  # auto-scaling até 3x
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Alta disponibilidade
  multi_az = var.environment == "production" ? true : false

  # Backup
  backup_retention_period   = 7        # dias
  backup_window             = "03:00-04:00"
  maintenance_window        = "sun:04:00-sun:05:00"
  delete_automated_backups  = false
  deletion_protection       = var.environment == "production" ? true : false

  # Performance
  performance_insights_enabled          = true
  performance_insights_retention_period = 7
  monitoring_interval                   = 60
  enabled_cloudwatch_logs_exports       = ["postgresql", "upgrade"]

  skip_final_snapshot = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "${local.name}-final-snapshot" : null

  tags = local.tags
}

# ─── Read Replica (apenas produção) ──────────────────────────────────────────
resource "aws_db_instance" "replica" {
  count = var.environment == "production" ? 1 : 0

  identifier             = "${local.name}-replica"
  replicate_source_db    = aws_db_instance.main.identifier
  instance_class         = var.instance_class
  storage_encrypted      = true
  publicly_accessible    = false
  skip_final_snapshot    = true
  performance_insights_enabled = true

  tags = merge(local.tags, { Role = "read-replica" })
}

# ─── Outputs ─────────────────────────────────────────────────────────────────
output "endpoint"         { value = aws_db_instance.main.endpoint }
output "replica_endpoint" { value = length(aws_db_instance.replica) > 0 ? aws_db_instance.replica[0].endpoint : "" }
output "db_name"          { value = var.db_name }
output "port"             { value = aws_db_instance.main.port }
