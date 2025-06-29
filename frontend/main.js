// Get form data
const destination = form.elements[0].value;
const startDate = form.elements[1].value;
const endDate = form.elements[2].value;
const budget = form.elements[3].value;
const preferences = form.elements[4].value;

// Clear and show loading
resultDiv.innerHTML = `
  <div style="text-align:center; padding:20px;">
    <p>🧳 AI is planning your trip...</p>
  </div>
`;

try {
  const response = await fetch("http://localhost:5000/api/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      destination,
      start_date: startDate,
      end_date: endDate,
      budget,
      preferences
    })
  });

  const data = await response.json();

  if (data && data.plan) {
    resultDiv.innerHTML = `
      <div class="ai-plan-card">
        <h3>📍 Your AI Travel Plan</h3>
        <p>${data.plan.replace(/\n/g, "<br>")}</p>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `<p>❌ Couldn't generate a plan. Please try again.</p>`;
  }
} catch (error) {
  console.error("Error:", error);
  resultDiv.innerHTML = `<p>⚠️ Server error. Try again later.</p>`;
}
