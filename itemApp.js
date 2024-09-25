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
        const itemData = JSON.parse(event.body || '{}');
        console.log("The item data is: ", itemData);
        // Delete item if requested
        if (itemData.wannaDelete) {
            const params = {
                TableName: TableName,
                Key: {
                    PK: itemData.companyId,
                    SK: "CATEGORY#" + itemData.categoryName, // Sort key
                },
            };
            await db.delete(params).promise();
            return { statusCode: 200, body: JSON.stringify("Deleted successfully") };
        }
        // Get item if requested
        if (itemData.wannaGet) {
            const params = {
                TableName: TableName,
                KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
                ExpressionAttributeValues: {
                    ':pk': itemData.companyId,
                    ':sk': "CATEGORY#" + itemData.categoryName, // Sort key
                },
            };
            const data = await db.query(params).promise();
            return { statusCode: 200, body: JSON.stringify(data) };
        }
        // Insert new item
        const newItem = {
            PK: itemData.companyId,
            SK: "ITEMS#" + itemData.creatorMailId + "#" + itemData.categoryName,
            creatorMailId: itemData.creatorMailId,
            ticketNo: itemData.ticketNo,
            assetId: itemData.assetId,
            categoryName: itemData.categoryName,
            categoryAdmin: itemData.categoryAdmin,
            comments: itemData.comments,
            companyId: itemData.companyId,
            description: itemData.description,
            history: itemData.history,
            imageKey: itemData.imageKey,
            isDeleted: itemData.isDeleted,
            request: itemData.request,
            requestToAll: itemData.requestToAll,
            requestCreatedTime: itemData.requestCreatedTime,
            requester: itemData.requester,
            requestTitle: itemData.requestTitle,
            requestTo: itemData.requestTo,
            status: itemData.status,
            track: itemData.track,
        };
        await db.put({
            TableName,
            Item: newItem,
        }).promise();
        return { statusCode: 200, body: JSON.stringify("Item created successfully") };
    }
    catch (error) {
        console.error("Error processing request:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }
};
exports.create = create;
