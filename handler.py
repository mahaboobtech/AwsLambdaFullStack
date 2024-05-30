import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.client('dynamodb') #replace your dynamodb name here 

#where ever your s3 front end hosted link just replace yours and also your dynamodb name 
def lambda_handler(event, context):
    try:
        if event['httpMethod'] == 'OPTIONS':
            # Return a successful response to the OPTIONS preflight request
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': 'http://yours3bucket.s3.amazonaws.com', #replace your bucket where the front end hostd
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'  # Adjust allowed methods as needed
                }
            }

        # Parse incoming JSON data from the event
        request_data = json.loads(event['body'])

        # Access specific data from the request
        name = request_data.get('name')
        email = request_data.get('email')
        description = request_data.get('description')
        paymentId = request_data.get('paymentId')

        # Prepare the item to be stored in DynamoDB
        item = {
            'name': {'S': name},
            'email': {'S': email},
            'description': {'S': description},
            'paymentId': {'S': paymentId}
        }

        # Store the item in DynamoDB
        dynamodb.put_item(
            TableName='testdynamoacess',
            Item=item
        )

        # Create a success response with CORS headers
        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': 'http://yours3bucket.s3.amazonaws.com',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'  # Adjust allowed methods as needed
            },
            'body': json.dumps({
                'message': 'Data received and stored successfully',
                'storedData': item  # Returning the received data for reference
            })
        }

        return response
    except Exception as e:
        print("Error:", e)
        # Return an error response with CORS headers
        error_response = {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': 'http://yours3bucket.s3.amazonaws.com',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'  # Adjust allowed methods as needed
            },
            'body': json.dumps({
                'message': 'Internal Server Error'
            })
        }

        return error_response
