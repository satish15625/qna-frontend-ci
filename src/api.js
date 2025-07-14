// // export const askQuestion = async (question) => {
// //   try {
// //     const body = JSON.stringify({ question });  // ✅ Use the correct key: "question"
// //     console.log("Sending:", body);

// //     const response = await fetch("http://192.168.1.4:8000/ask-json", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: body,
// //     });

// //     const data = await response.json();
// //     return data.answer;
// //   } catch (error) {
// //     console.error("Error:", error);
// //     return "Error: Unable to get response from server.";
// //   }
// // };

// export async function askQuestion(question) {
//   const response = await fetch("http://192.168.1.4:8000/satisfaction", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ question }),
//   });

//   const data = await response.json();
//   return data.answer;
// }

// export async function markSatisfaction(question, satisfied) {
//   try {
//     const response = await fetch("http://192.168.1.4:8000/ask-json", {
//       method: "POST",
//       body: new URLSearchParams({ question, satisfied }),
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("❌ Failed to mark satisfaction:", error);
//     throw error;
//   }
// }


// api.js

export async function askQuestion(question) {
  try {
    const response = await fetch("http://192.168.1.6:8000/ask-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get response from server");
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("❌ askQuestion error:", error);
    return "❌ Failed to get answer from server.";
  }
}

export async function markSatisfaction(question, isSatisfied) {
  try {
    const response = await fetch("http://192.168.1.6:8000/mark-satisfaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        satisfied: isSatisfied,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to mark satisfaction");
    }

    return await response.json();
  } catch (err) {
    console.error("❌ markSatisfaction error:", err);
    throw err;
  }
}

