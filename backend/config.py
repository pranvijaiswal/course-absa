from urllib.parse import quote_plus

username = "pranvijaiswal1212_db_user"
password = "Pranvi@1212"  # your actual password

MONGO_URI = f"mongodb+srv://{username}:{quote_plus(password)}@cluster0.necster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

DB_NAME = "course-absa"
YOUTUBE_API_KEY = "AIzaSyCEfwla2I6o0I2R3dpWymyClDW8UtyRepY"
MAX_COMMENTS = 50