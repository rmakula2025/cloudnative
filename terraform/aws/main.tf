
provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "feature_flags" {
  name = "feature-flag-cluster"
}

resource "aws_elb" "feature_flags_lb" {
  name = "feature-flag-lb"
}
