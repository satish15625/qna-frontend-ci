// export const askQuestion = async (question) => {
//   try {
//     const response = await fetch("http://192.168.1.3:8000/query/", {
      
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ question }),
//     });
//     const data = await response.json();
//     return data.answer;
//   } catch (error) {
//     console.error("Error:", error);
//     return "Error: Unable to get response from server.";
//   }
// };


export const askQuestion = async (question) => {
  try {
    const body = JSON.stringify({ query: question });  // ✅ FIXED KEY
    console.log("Sending:", body);

    const response = await fetch("http://192.168.1.3:8000/query/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error:", error);
    return "Error: Unable to get response from server.";
  }
};
