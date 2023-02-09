#!/bin/bash -e

# pushes Docker Volcano Dashboard images to AWS ECR

VERSION='git-'`git rev-parse --short HEAD`
ACCOUNT=$(aws sts get-caller-identity --output text --query 'Account')

eval $(aws ecr get-login --no-include-email --region ap-southeast-2)
#for aws version2
#aws ecr get-login-password | docker login --username AWS --password-stdin ${ACCOUNT}.dkr.ecr.ap-southeast-2.amazonaws.com

docker push ${ACCOUNT}.dkr.ecr.ap-southeast-2.amazonaws.com/volcano-dashboard:$VERSION 
docker push ${ACCOUNT}.dkr.ecr.ap-southeast-2.amazonaws.com/volcano-dashboard:latest


