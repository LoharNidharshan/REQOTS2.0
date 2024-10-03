# REQO
# Overview
This project defines multiple Lambda functions for handling CRUD operations related to users, companies, categories, and items. It also includes an AWS Lambda token authorizer for securing API endpoints using a custom token-based authorization mechanism.

The project uses AWS SAM to define resources such as Lambda functions built in TYPESCRIPT , API Gateway, and DynamoDB tables.

# Prerequisites
To deploy and run this project, you'll need the following:

AWS CLI installed and configured
AWS SAM CLI installed
Node.js (version 18.x or 20.x) installed
An AWS account with necessary permissions to deploy serverless resources (Lambda, API Gateway, DynamoDB)
# Architecture
## Lambda Functions: 
The core logic for CRUD operations related to Users, Companies, Categories, and Items.
## DynamoDB: 
Stores the data for users, companies, categories, and items.
## API Gateway: 
Provides RESTful API endpoints for interacting with the system.
## Lambda Token Authorizer: 
Used for securing the API endpoints with custom token-based authorization.
# AWS Resources
The following resources are created:

API Gateway: Acts as an entry point for the client requests.
Lambda Functions: Each resource (Users, Companies, Categories, and Items) has its own Lambda function.
DynamoDB Table: A single table reqoTable that holds the data for all resources, using PK (Partition Key) and SK (Sort Key) to structure the data.
Lambda Token Authorizer: A custom Lambda function that authorizes requests to API Gateway endpoints.
Lambda Functions
Each Lambda function handles CRUD operations for a specific resource:

User Function: ./UserCrud/app.js
Company Function: ./CompanyCrud/app.js
Category Function: ./CategoryCrud/app.js
Item Function: ./ItemCrud/app.js

# DynamoDB Table Structure
The DynamoDB table uses composite keys with a Partition Key (PK) and a Sort Key (SK) to organize the data.

PK: Primary partition key, generally represents the main entity (e.g., companyId, categoryId).
SK: Sort key, used to store specific attributes related to the partition key (e.g., CATEGORY#categoryName).
## Example Data Structure
Users: PK = companyId, SK = USERS#emailId
Companies: PK = COMPANY, SK = companyId
Categories: PK = companyId, SK = CATEGORY#categoryName
Items: PK = companyId, SK = ITEMS#creatorMailId#categoryName
## Token Authorizer
The Lambda token authorizer is responsible for authorizing API requests. It verifies the token included in the request headers and allows or denies access to the # # API Gateway endpoints.

## API Endpoints
Users: /users (POST)
Companies: /companies (POST)
Categories: /categories (POST)
Items: /items (POST)
# Deployment
## Step 1: Install Dependencies
```bash
npm install
```
## Step 2: Build the Project
```bash
npm run build
```
## Step 3: Deploy the Project
```bash
sam build
sam deploy --guided
```
Follow the on-screen instructions to complete the deployment.

Usage
Once deployed, you can interact with the API using tools like Postman or curl. Make sure to include the correct authorization token in the request headers for secured endpoints.
