import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const db = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TABLE_NAME || 'testTable'; // Fallback to 'testTable' if TABLE_NAME is not set

// Type definitions for the employee data
interface EmployeeData {
  companyId: string;
  actualEmployeeCount?: number;
  companyOrigin?: string;
  companySector?: string;
  companySize?: string;
  customerId?: string;
  description?: string;
  invoiceId?: string;
  isDeleted?: boolean;
  paidEmployeeCount?: number;
  subscriptionEnded?: string;
  subscriptionId?: string;
  subscriptionStartDate?: string;
  subscriptionStatus?: string;
  subscriptionType?: string;
  companyName?: string;
  wannaDelete?: boolean;
  wannaGet?: boolean;
}

// Main Lambda function to handle different operations
export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const empData: EmployeeData = JSON.parse(event.body || '{}');

  if (empData.wannaDelete) {
    return deletion(event.body);
  } else if (empData.wannaGet) {
    return fetching(event.body);
  } else {
    return inserting(event.body);
  }
};

// Insert data into DynamoDB
export async function inserting(body: string | null): Promise<APIGatewayProxyResult> {
  if (!body) {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  const empData: EmployeeData = JSON.parse(body);

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

// Delete an item from DynamoDB
export async function deletion(body: string | null): Promise<APIGatewayProxyResult> {
  if (!body) {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  const empData: EmployeeData = JSON.parse(body);

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

// Fetch data from DynamoDB
export async function fetching(body: string | null): Promise<APIGatewayProxyResult> {
  if (!body) {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  const empData: EmployeeData = JSON.parse(body);

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
