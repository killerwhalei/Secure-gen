async function scanCode() {
  const code = document.getElementById('codeInput').value.trim();
  const resultBox = document.getElementById('result');
  const explanation = document.getElementById('vulnExplanation');
  const fix = document.getElementById('fixSuggestion');

  if (!code) {
    alert("⚠️ Please paste some code to scan.");
    return;
  }

  explanation.innerHTML = "🧠 Scanning with AI...";
  fix.innerHTML = "";
  resultBox.classList.remove('d-none');

  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const parsed = await response.json();

    if (parsed.issues?.length || parsed.fixes?.length) {
      explanation.innerHTML = parsed.issues.map(issue => `<div>❌ ${issue}</div>`).join('') || "✅ No issues found.";
      fix.innerHTML = parsed.fixes.map(f => `<div>✔️ ${f}</div>`).join('') || "✔️ No suggestions.";
    } else {
      explanation.innerHTML = "⚠️ AI did not return clear results.";
      fix.innerHTML = "";
    }

  } catch (error) {
    // If AI fails, use the manual scan
    console.error("AI Scan Error:", error);  // Log the detailed error
    manualScanCode();  // Call the manual scan instead of showing the error message
  }
}

// Manual vulnerability scanning function
function manualScanCode() {
  const code = document.getElementById('codeInput').value.trim();
  const resultBox = document.getElementById('result');
  const explanation = document.getElementById('vulnExplanation');
  const fix = document.getElementById('fixSuggestion');

  if (!code) {
    alert("⚠️ Please paste some code to scan.");
    return;
  }

  explanation.innerHTML = "🧠 Scanning with basic checks...";
  fix.innerHTML = "";
  resultBox.classList.remove('d-none');

  // Initialize an array to hold detected issues
  const issues = [];
  const fixes = [];

  // Check for security misconfiguration (debug=True)
  if (code.includes("debug=True")) {
    issues.push("Potential security misconfiguration: Debug mode is enabled.");
    fixes.push("Disable debug mode in production code.");
  }

  // Check for potential SQL Injection
  if (code.includes("SELECT * FROM") && (code.includes("input") || code.includes("request"))) {
    issues.push("Potential SQL Injection: Unsanitized user input in SQL query.");
    fixes.push("Sanitize user input and use parameterized queries.");
  }

  // Check for potential XSS (using innerHTML or document.write)
  if (code.includes("document.write") || code.includes("innerHTML")) {
    issues.push("Potential XSS: Dynamic content inserted without sanitization.");
    fixes.push("Use textContent or innerText for inserting user input.");
  }

  // Check for insecure deserialization (pickle)
  if (code.includes("pickle.loads")) {
    issues.push("Insecure Deserialization: Use of insecure deserialization method 'pickle'.");
    fixes.push("Avoid using pickle for deserialization, use JSON or a safer method.");
  }

  // Check for potential buffer overflow (unsafe functions like strcpy)
  if (code.includes("strcpy") || code.includes("gets")) {
    issues.push("Potential Buffer Overflow: Use of unsafe memory manipulation.");
    fixes.push("Avoid using unsafe functions like strcpy and gets. Use safer alternatives.");
  }

  // If issues were found, display them
  if (issues.length > 0) {
    explanation.innerHTML = issues.map(issue => `<div>❌ ${issue}</div>`).join('');
    fix.innerHTML = fixes.map(f => `<div>✔️ ${f}</div>`).join('');
  } else {
    explanation.innerHTML = "✅ No issues found.";
    fix.innerHTML = "✔️ No suggestions.";
  }
}

// Function to clear the results and input fields
function clearResults() {
  // Clear the code input field
  document.getElementById('codeInput').value = '';

  // Hide the result box
  document.getElementById('result').classList.add('d-none');

  // Clear the vulnerability explanation and fix suggestion areas
  document.getElementById('vulnExplanation').innerHTML = '';
  document.getElementById('fixSuggestion').innerHTML = '';
}
