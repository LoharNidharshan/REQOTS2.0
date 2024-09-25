import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Initialize DynamoDB DocumentClient
const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME as string;

// Define the type for item data
interface ItemData {
  companyId: string;
  categoryName: string;
  creatorMailId: string;
  ticketNo?: string;
  assetId?: string;
  categoryAdmin?: string;
  comments?: string;
  description?: string;
  history?: string[];
  imageKey?: string;
  isDeleted?: boolean;
  request?: string;
  requestToAll?: boolean;
  requestCreatedTime?: string;
  requester?: string;
  requestTitle?: string;
  requestTo?: string;
  status?: string;
  track?: string;
  wannaDelete?: boolean;
  wannaGet?: boolean;
}

// Create function to handle DynamoDB operations
export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const itemData: ItemData = JSON.parse(event.body || '{}');
    console.log("The item data is: ", itemData);

    // Delete item if requested
    if (itemData.wannaDelete) {
      const params: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: TableName,
        Key: {
          PK: itemData.companyId, // Partition key
          SK: "CATEGORY#" + itemData.categoryName, // Sort key
        },
      };
      await db.delete(params).promise();
      return { statusCode: 200, body: JSON.stringify("Deleted successfully") };
    }

    // Get item if requested
    if (itemData.wannaGet) {
      const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: TableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': itemData.companyId, // Partition key
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
  } catch (error) {
    console.error("Error processing request:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
