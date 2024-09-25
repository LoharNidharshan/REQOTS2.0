import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Initialize DynamoDB DocumentClient
const db = new DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME as string;

// Define the type for employee data
interface EmployeeData {
  companyId: string;
  emailId: string;
  empId?: string;
  empName?: string;
  doj?: string;
  empAdd?: string;
  empContact?: string;
  empRole?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  responderId?: string;
  roleChange?: string;
  requestApproved?: boolean;
  wannaDelete?: boolean;
  wannaGet?: boolean;
}

// Create function to handle DynamoDB operations
export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const empData: EmployeeData = JSON.parse(event.body || '{}');
    console.log("The employee data is: " + empData.empName);

    if (empData.wannaDelete) {
      const params: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: TableName,
        Key: {
          PK: empData.companyId, // Partition key
          SK: "USERS#" + empData.emailId // Sort key
        }
      };
      await db.delete(params).promise();
      return { statusCode: 200, body: JSON.stringify("Deleted successfully") };
    }

    if (empData.wannaGet) {
      const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: TableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': empData.companyId, // Partition key
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
  } catch (error) {
    console.error("Error processing request:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
  }
};
