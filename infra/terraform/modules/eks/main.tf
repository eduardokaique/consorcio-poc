/**
 * Módulo EKS — Kubernetes gerenciado
 * Node groups: system (on-demand) + app (spot para custo)
 */

variable "project"        { type = string }
variable "environment"    { type = string }
variable "vpc_id"         { type = string }
variable "subnet_ids"     { type = list(string) }
variable "cluster_version" { type = string, default = "1.31" }

locals {
  name = "${var.project}-${var.environment}"
  tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ─── IAM Role — Cluster ───────────────────────────────────────────────────────
resource "aws_iam_role" "cluster" {
  name = "${local.name}-eks-cluster-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
    }]
  })
  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "cluster_policy" {
  role       = aws_iam_role.cluster.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# ─── IAM Role — Node Group ────────────────────────────────────────────────────
resource "aws_iam_role" "node" {
  name = "${local.name}-eks-node-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "node_policies" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
  ])
  role       = aws_iam_role.node.name
  policy_arn = each.value
}

# ─── EKS Cluster ─────────────────────────────────────────────────────────────
resource "aws_eks_cluster" "main" {
  name     = local.name
  role_arn = aws_iam_role.cluster.arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = var.environment != "production"
    public_access_cidrs     = var.environment != "production" ? ["0.0.0.0/0"] : []
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  tags       = local.tags
  depends_on = [aws_iam_role_policy_attachment.cluster_policy]
}

# ─── Node Group: system (on-demand, pequeno) ─────────────────────────────────
resource "aws_eks_node_group" "system" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${local.name}-system"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.subnet_ids
  instance_types  = ["t3.medium"]
  capacity_type   = "ON_DEMAND"

  scaling_config {
    min_size     = 2
    max_size     = 4
    desired_size = 2
  }

  taint {
    key    = "node-role"
    value  = "system"
    effect = "NO_SCHEDULE"
  }

  labels = { role = "system" }
  tags   = local.tags
  depends_on = [aws_iam_role_policy_attachment.node_policies]
}

# ─── Node Group: app (spot para custo reduzido) ───────────────────────────────
resource "aws_eks_node_group" "app" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${local.name}-app"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.subnet_ids
  instance_types  = ["t3.large", "t3a.large", "m5.large"]
  capacity_type   = "SPOT"

  scaling_config {
    min_size     = var.environment == "production" ? 3 : 1
    max_size     = var.environment == "production" ? 20 : 5
    desired_size = var.environment == "production" ? 3 : 1
  }

  labels = { role = "app" }
  tags   = local.tags
  depends_on = [aws_iam_role_policy_attachment.node_policies]
}

# ─── Outputs ─────────────────────────────────────────────────────────────────
output "cluster_name"     { value = aws_eks_cluster.main.name }
output "cluster_endpoint" { value = aws_eks_cluster.main.endpoint }
output "cluster_ca"       { value = aws_eks_cluster.main.certificate_authority[0].data }
output "oidc_issuer"      { value = aws_eks_cluster.main.identity[0].oidc[0].issuer }
