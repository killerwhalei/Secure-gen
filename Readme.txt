
# SecureGen - AI-powered Code Security Auditor

## Overview
SecureGen is a web-based AI-powered code security auditor designed to detect vulnerabilities and security flaws in code. It uses OpenAI's GPT model to analyze code and return potential vulnerabilities and suggested fixes. The application also features a manual fallback scanning process for common vulnerabilities.

## Features
- AI-based code scanning using OpenAI's GPT model.
- Manual fallback for common vulnerabilities like SQL Injection, XSS, and insecure deserialization.
- Web-based frontend for code input and results display.
- FastAPI backend for code analysis and response handling.

---

## Setup Instructions

### 1. Install Requirements

#### Backend (Python):
- Install Python 3.8+.
- Install the necessary Python packages:
  ```bash
  pip install fastapi uvicorn openai python-dotenv pydantic
  ```

#### Frontend (JavaScript/HTML):
- The frontend is a basic HTML/JS page that can be served via any web server (like a local server on `http://127.0.0.1:5500`).
- You can open the `index.html` file directly in the browser or use a local server setup (e.g., Live Server in VS Code).

---

### 2. Backend Setup (Python)
#### a. Create a `.env` file
In the root directory of the project, create a `.env` file to store your OpenAI API key:
```bash
OPENAI_API_KEY=your-api-key-here
```

#### b. Start the FastAPI Server
Run the FastAPI backend using `uvicorn`:
```bash
uvicorn main:app --reload
```
- The server will be available at `http://127.0.0.1:8000`.
- The backend has one endpoint: `POST /analyze` which receives code for analysis.

---

### 3. Frontend Setup (HTML/JavaScript)
#### a. Open the `index.html` file
- Open the `index.html` file in your browser (or via a local server like `http://127.0.0.1:5500`).
- The input field allows you to paste code, which is then sent to the backend for analysis.

#### b. Configure Frontend to Connect to the Backend
The frontend is configured to send requests to `http://localhost:8000/analyze`. Make sure your FastAPI server is running and accessible at this address.

---

### 4. Using the Application

#### a. Paste Your Code
- Open the `index.html` in your browser and paste the code you want to analyze into the input field.
  
#### b. AI Analysis
- Upon submitting the form, the frontend will send the code to the FastAPI backend, which will first attempt to analyze the code using OpenAI's API.
  
#### c. Manual Fallback
- If the AI fails (e.g., non-JSON response or API error), the frontend will run a manual analysis, checking for basic vulnerabilities like:
  - Security Misconfiguration (e.g., `debug=True` in code).
  - SQL Injection.
  - Cross-Site Scripting (XSS).
  - Insecure Deserialization.
  - Buffer Overflow vulnerabilities.

#### d. View Results
- The results of the scan (either AI-generated or manual) will be displayed in the UI, listing any detected vulnerabilities and suggested fixes.

---

## File Structure

```
/securegen
    ├── .env                    # Stores the OpenAI API key
    ├── main.py                 # FastAPI backend
    ├── index.html              # Frontend HTML
    ├── static/
        ├── script.js           # Frontend JavaScript
    └── README.txt              # This file
```

---

## API Details

### Endpoint: `/analyze` (POST)
#### Request Body:
```json
{
  "code": "<code-snippet-here>"
}
```

#### Response Body:
```json
{
  "issues": ["issue1", "issue2"],
  "fixes": ["fix1", "fix2"]
}
```

If the AI fails to generate a valid response, the response will contain:
```json
{
  "issues": ["❌ AI response was not in expected JSON format."],
  "fixes": []
}
```

---

## Troubleshooting

- **API Key Error**: Make sure that you have correctly set your OpenAI API key in the `.env` file.
- **CORS Issues**: If you're getting CORS errors, ensure that the frontend URL (`http://127.0.0.1:5500`) matches the `allow_origins` parameter in the FastAPI middleware.

---

License
This project is open source and is available under the MIT License.
 It was developed by Tech Exploits with the help of various open-source technologies.

---

## Future Improvements

- Expand the AI analysis to cover more security vulnerabilities.
- Improve the manual vulnerability scanning with additional checks for other security flaws.
