export const askQuestion = async (question) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/ask-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error:", error);
    return "Error: Unable to get response from server.";
  }
};
