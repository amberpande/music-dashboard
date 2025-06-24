from dotenv import load_dotenv
import os
import boto3
from botocore.client import Config
import pandas as pd
from io import StringIO
from datetime import datetime
import json

def get_aws_credentials():
    # Try to get the AWS credentials from environment variables first
    load_dotenv()
    aws_access_key_id = os.getenv('AWS_ID')
    aws_secret_access_key = os.getenv('AWS_SEC')

    return aws_access_key_id, aws_secret_access_key

AWS_ID, AWS_SEC = get_aws_credentials()

def get_secret(secret_name):
    region_name = "us-east-2"  # Set to the desired AWS region

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        aws_access_key_id=AWS_ID,
        aws_secret_access_key=AWS_SEC,
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except Exception as e:
        print(e)
        raise e
    
    # Decrypts secret using the associated KMS CMK.
    # Depending on whether the secret is a string or binary, one of these fields will be populated.
    if 'SecretString' in get_secret_value_response:
        secret = get_secret_value_response['SecretString']
        secret_dict = json.loads(secret)
        return secret_dict
    else:
        # Your logic to handle the binary secret goes here
        # Assuming you don't store API keys as binary, this part may not be necessary
        raise Exception('Binary secret format is not supported.')


def connect_to_s3(timeout=10, client=False):
    """Establish a connection to S3 using the credentials in config.py."""
    # Create a Config object with the desired timeout settings
    config = Config(
        connect_timeout=timeout,
        read_timeout=timeout,
        retries={'max_attempts': 3}  # Example of setting max retry attempts
    )

    if client:
        # Use boto3.client for low-level API access
        s3 = boto3.client(
            's3',
            aws_access_key_id=AWS_ID,
            aws_secret_access_key=AWS_SEC,
            config=config
        )
    else:
        # Use boto3.resource for high-level resource access
        s3 = boto3.resource(
            's3',
            aws_access_key_id=AWS_ID,
            aws_secret_access_key=AWS_SEC,
            config=config
        )

    return s3


def retrieve_csv_files_from_s3(bucket_name, s3):
    """Retrieve all CSV files from an S3 bucket."""
    bucket = s3.Bucket(bucket_name)
    csv_files = [obj.key for obj in bucket.objects.all() if obj.key.endswith('.csv')]
    return csv_files

def load_csv_from_s3(bucket_name, file_key, s3):
    """Load a CSV file from S3 into a Pandas DataFrame."""
    client = s3.meta.client
    csv_obj = client.get_object(Bucket=bucket_name, Key=file_key)
    csv_data = csv_obj['Body'].read().decode('utf-8')
    return pd.read_csv(StringIO(csv_data))

def delete_file_from_s3(bucket_name, file_key, s3):
    """Delete a specific file from an S3 bucket."""
    obj = s3.Object(bucket_name, file_key)
    obj.delete()

def cloud_dump(setlist, args=None, dump_all=False):
    # Initialize AWS S3 resources and client
    s3_resource = boto3.resource(
        's3',
        aws_access_key_id=AWS_ID,
        aws_secret_access_key=AWS_SEC
    )
    
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ID,
        aws_secret_access_key=AWS_SEC
    )

    # Determine bucket name and filtering based on the mode
    if dump_all and args is not None:
        bucket_name = 'vibesets'
        data_to_dump = setlist
        # Create filename using args dictionary
        args_str = '_'.join([f"{key}-{value}" for key, value in args.items()])
        file_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{args_str}.csv"
    else:
        bucket_name = 'chatgpt-setlist-to-database'
        # Filter the dataframe
        data_to_dump = setlist[(setlist['in_database'] == False) & (setlist['is_hallucination'] == False)]
        file_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
        if data_to_dump.empty:
            print("No songs to dump.")
            return

    # Convert the DataFrame into a CSV string
    csv_buffer = StringIO()
    data_to_dump.to_csv(csv_buffer, index=False)

    # Check if bucket exists; if not, create it
    if bucket_name not in [bucket['Name'] for bucket in s3_client.list_buckets()['Buckets']]:
        s3_client.create_bucket(Bucket=bucket_name)
        print(f"S3 bucket {bucket_name} created.")

    # Put the object (upload the file)
    s3_resource.Object(bucket_name, file_name).put(Body=csv_buffer.getvalue())

    print(f"Dumped to {file_name} in S3 bucket {bucket_name}.")
