"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetching = exports.deletion = exports.inserting = exports.create = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const db = new aws_sdk_1.default.DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME || 'testTable'; // Fallback to 'testTable' if TABLE_NAME is not set
// Main Lambda function to handle different operations
const create = async (event) => {
    const empData = JSON.parse(event.body || '{}');
    if (empData.wannaDelete) {
        return deletion(event.body);
    }
    else if (empData.wannaGet) {
        return fetching(event.body);
    }
    else {
        return inserting(event.body);
    }
};
exports.create = create;
// Insert data into DynamoDB
async function inserting(body) {
    if (!body) {
        return { statusCode: 400, body: 'Invalid request body' };
    }
    const empData = JSON.parse(body);
    const newCompany = {
        PK: 'COMPANY',
        SK: empData.companyId,
        actualEmployeeCount: empData.actualEmployeeCount,
        companyOrigin: empData.companyOrigin,
        companySector: empData.companySector,
        companySize: empData.companySize,
        customerId: empData.customerId,
        description: empData.description,
        invoiceId: empData.invoiceId,
        isDeleted: empData.isDeleted,
        paidEmployeeCount: empData.paidEmployeeCount,
        subscriptionEnded: empData.subscriptionEnded,
        subscriptionId: empData.subscriptionId,
        subscriptionStartDate: empData.subscriptionStartDate,
        subscriptionStatus: empData.subscriptionStatus,
        subscriptionType: empData.subscriptionType,
        companyName: empData.companyName,
        companyId: empData.companyId,
    };
    await db
        .put({
        TableName,
        Item: newCompany,
    })
        .promise();
    return { statusCode: 200, body: JSON.stringify('Company has been created successfully!') };
}
exports.inserting = inserting;
// Delete an item from DynamoDB
async function deletion(body) {
    if (!body) {
        return { statusCode: 400, body: 'Invalid request body' };
    }
    const empData = JSON.parse(body);
    if (empData.wannaDelete) {
        const params = {
            TableName,
            Key: {
                PK: 'COMPANY',
                SK: empData.companyId,
            },
        };
        await db.delete(params).promise();
        return { statusCode: 200, body: JSON.stringify('Deleted successfully') };
    }
    return { statusCode: 400, body: 'Invalid request' };
}
exports.deletion = deletion;
// Fetch data from DynamoDB
async function fetching(body) {
    if (!body) {
        return { statusCode: 400, body: 'Invalid request body' };
    }
    const empData = JSON.parse(body);
    if (empData.wannaGet) {
        const params = {
            TableName,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': 'COMPANY',
                ':sk': empData.companyId,
            },
        };
        const data = await db.query(params).promise();
        return { statusCode: 200, body: JSON.stringify(data) };
    }
    return { statusCode: 400, body: 'Invalid request' };
}
exports.fetching = fetching;
