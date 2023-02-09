#!/bin/bash -eu

# Build container image for AWS ECR

VERSION='git-'$(git rev-parse --short HEAD)
ACCOUNT=$(aws sts get-caller-identity --output text --query 'Account')

docker build -t "${ACCOUNT}.dkr.ecr.ap-southeast-2.amazonaws.com/volcano-dashboard:$VERSION" -f Dockerfile .
docker tag \
    "${ACCOUNT}.dkr.ecr.ap-southeast-2.amazonaws.com/volcano-dashboard:$VERSION" \
    "${ACCOUNT}.dkr.ecr.ap-southeast-2.amazonaws.com/volcano-dashboard:latest"

