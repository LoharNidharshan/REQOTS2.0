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
        const categoryData = JSON.parse(event.body || '{}');
        console.log("The category data is: ", categoryData);
        // Delete category if requested
        if (categoryData.wannaDelete) {
            const params = {
                TableName: TableName,
                Key: {
                    PK: categoryData.companyId,
                    SK: "CATEGORY#" + categoryData.categoryName, // Sort key
                },
            };
            await db.delete(params).promise();
            return { statusCode: 200, body: JSON.stringify("Deleted successfully") };
        }
        // Get category if requested
        if (categoryData.wannaGet) {
            const params = {
                TableName: TableName,
                KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
                ExpressionAttributeValues: {
                    ':pk': categoryData.companyId,
                    ':sk': "CATEGORY#" + categoryData.categoryName, // Sort key
                },
            };
            const data = await db.query(params).promise();
            return { statusCode: 200, body: JSON.stringify(data) };
        }
        // Insert new category
        const newCategory = {
            PK: categoryData.companyId,
            SK: "CATEGORY#" + categoryData.categoryName,
            id: categoryData.id,
            categoryAdmin: categoryData.categoryAdmin,
            secondaryCategoryAdmin: categoryData.secondaryCategoryAdmin,
            tertiaryCategoryAdmin: categoryData.tertiaryCategoryAdmin,
            categoryItems: categoryData.categoryItems,
            categoryName: categoryData.categoryName,
            checked: categoryData.checked,
            createdDate: categoryData.createdDate,
            defaultItems: categoryData.defaultItems,
            isDefaultItemsSelect: categoryData.isDefaultItemsSelect,
            createdBy: categoryData.createdBy,
            isDeleted: categoryData.isDeleted,
            selectedAdmins: categoryData.selectedAdmins,
        };
        await db.put({
            TableName,
            Item: newCategory,
        }).promise();
        return { statusCode: 200, body: JSON.stringify("Category created successfully") };
    }
    catch (error) {
        console.error("Error processing request:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }
};
exports.create = create;
