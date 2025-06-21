export const askQuestion = async (question) => {
  try {
    const response = await fetch("https://09f3-106-219-153-31.ngrok-free.app/ask-json", {
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
