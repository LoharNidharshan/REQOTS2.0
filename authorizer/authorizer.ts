import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

// Define the handler function with proper types
export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log(event);

  // By default, deny access
  let effect: 'Allow' | 'Deny' = 'Deny';

  // Retrieve the token from the event
  const token: string = event.authorizationToken;

  // Here you could:
  // 1. Call an OAuth provider
  // 2. Lookup this token in your database (if you self-manage tokens)
  // 3. Decode the JWT token and do additional verifications

  // Check if the token is valid
  if (token === 'MySecretToken') {
    effect = 'Allow';
  }

  // Get the resource
  const resource: string = event.methodArn;

  // Construct the policy response
  const authResponse: APIGatewayAuthorizerResult = {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context: {
      tenant: 'tenant1',
    },
  };

  // Return the response
  return authResponse;
};
