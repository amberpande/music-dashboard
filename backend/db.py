import psycopg2
from psycopg2.extras import RealDictCursor
import os
from backend.aws_utils import get_secret

# Load database credentials
secrets = get_secret('vibeset/database')

# Database connection parameters
DB_HOST = secrets['host']
DB_PORT = secrets['port']
DB_NAME = secrets['engine']
DB_USER = secrets['username']
DB_PASSWORD = secrets['password']

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
    )