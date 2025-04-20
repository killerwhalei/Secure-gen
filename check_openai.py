import openai
from dotenv import load_dotenv
import os

# Load the API key from the .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

try:
    response = openai.Completion.create(model="text-davinci-003", prompt="Say hello!", max_tokens=5)
    print(response)
except Exception as e:
    print(f"Error with OpenAI API: {str(e)}")
