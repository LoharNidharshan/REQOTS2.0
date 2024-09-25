"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const aws_sdk_1 = require("aws-sdk");
// Initialize DynamoDB DocumentClient
const db = new aws_sdk_1.DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME;
// Create function to handle DynamoDB operations
const create = async (event) => {
    try {
        const empData = JSON.parse(event.body || '{}');
        console.log("The employee data is: " + empData.empName);
        if (empData.wannaDelete) {
            const params = {
                TableName: TableName,
                Key: {
                    PK: empData.companyId,
                    SK: "USERS#" + empData.emailId // Sort key
                }
            };
            await db.delete(params).promise();
            return { statusCode: 200, body: JSON.stringify("Deleted successfully") };
        }
        if (empData.wannaGet) {
            const params = {
                TableName: TableName,
                KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
                ExpressionAttributeValues: {
                    ':pk': empData.companyId,
                    ':sk': "USERS#" + empData.emailId // Sort key
                }
            };
            const data = await db.query(params).promise();
            return { statusCode: 200, body: JSON.stringify(data) };
        }
        const newUser = {
            PK: empData.companyId,
            SK: "USERS#" + empData.emailId,
            emailId: empData.emailId,
            doj: empData.doj,
            empAdd: empData.empAdd,
            empContact: empData.empContact,
            empId: empData.empId,
            empName: empData.empName,
            empRole: empData.empRole,
            isActive: empData.isActive,
            isDeleted: empData.isDeleted,
            responderId: empData.responderId,
            roleChange: empData.roleChange,
            companyId: empData.companyId,
            requestApproved: empData.requestApproved
        };
        await db.put({
            TableName,
            Item: newUser
        }).promise();
        return { statusCode: 200, body: JSON.stringify("User created successfully") };
    }
    catch (error) {
        console.error("Error processing request:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }
};
exports.create = create;
