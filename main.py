from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import os
import json

# Load .env and ensure API key is set
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OpenAI API Key is not set in the .env file!")

# FastAPI app
app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Allow frontend URL (adjust if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Request model
class CodeRequest(BaseModel):
    code: str

def check_for_basic_vulnerabilities(code_snippet: str):
    # Example vulnerability checks
    issues = []

    # Security Misconfiguration (e.g., debug=True)
    if "debug=True" in code_snippet:
        issues.append("Potential security misconfiguration: Debug mode is enabled.")

    # SQL Injection (e.g., unsanitized user input in queries)
    if "SELECT * FROM" in code_snippet and ("input" in code_snippet or "request" in code_snippet):
        issues.append("Potential SQL Injection: Unsanitized user input in SQL query.")

    # Cross-Site Scripting (XSS)
    if "document.write" in code_snippet or "innerHTML" in code_snippet:
        issues.append("Potential XSS: Dynamic content inserted without sanitization.")

    # Insecure Deserialization (e.g., use of pickle)
    if "pickle.loads" in code_snippet:
        issues.append("Insecure Deserialization: Use of insecure deserialization method 'pickle'.")

    # Buffer Overflow (for C/C++ unsafe functions)
    if "strcpy" in code_snippet or "gets" in code_snippet:
        issues.append("Buffer Overflow: Potential unsafe memory manipulation.")

    return issues

@app.post("/analyze")
async def analyze_code(payload: CodeRequest):
    code_snippet = payload.code.strip()

    # First, try to get results from the AI
    try:
        prompt = (
            f"You are a secure code analysis tool. Detect vulnerabilities, bugs, or bad practices in the following code.\n"
            f"Auto-detect the programming language. Return the response in strict JSON format like this:\n"
            f"{{\"issues\": [\"issue1\", \"issue2\"], \"fixes\": [\"fix1\", \"fix2\"]}}\n\n"
            f"Code:\n{code_snippet}"
        )

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[ 
                {"role": "system", "content": "You are a helpful AI security assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        # Extract and clean the AI response
        reply = response.choices[0].get('message', {}).get('content', "").strip()

        # Attempt to parse response as JSON
        try:
            data = json.loads(reply)
            return data
        except json.JSONDecodeError:
            print("Error: AI response not in valid JSON format")
            return {"issues": ["❌ AI response was not in expected JSON format."], "fixes": []}

    except Exception as e:
        print(f"AI Error: {str(e)}")  # Log the detailed error
        return {"detail": f"OpenAI API Error: {str(e)}"}

