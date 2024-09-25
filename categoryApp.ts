import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Initialize DynamoDB DocumentClient
const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME as string;

// Define the type for category data
interface CategoryData {
  companyId: string;
  categoryName: string;
  id?: string;
  categoryAdmin?: string;
  secondaryCategoryAdmin?: string;
  tertiaryCategoryAdmin?: string;
  categoryItems?: string[];
  checked?: boolean;
  createdDate?: string;
  defaultItems?: string[];
  isDefaultItemsSelect?: boolean;
  createdBy?: string;
  isDeleted?: boolean;
  selectedAdmins?: string[];
  wannaDelete?: boolean;
  wannaGet?: boolean;
}

// Create function to handle DynamoDB operations
export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const categoryData: CategoryData = JSON.parse(event.body || '{}');
    console.log("The category data is: ", categoryData);

    // Delete category if requested
    if (categoryData.wannaDelete) {
      const params: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: TableName,
        Key: {
          PK: categoryData.companyId, // Partition key
          SK: "CATEGORY#" + categoryData.categoryName, // Sort key
        },
      };
      await db.delete(params).promise();
      return { statusCode: 200, body: JSON.stringify("Deleted successfully") };
    }

    // Get category if requested
    if (categoryData.wannaGet) {
      const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: TableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': categoryData.companyId, // Partition key
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
  } catch (error) {
    console.error("Error processing request:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
