import FormSection from "./Components/FormSection";
import AnswerSection from "./Components/AnswerSection";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.css";
import { useState } from "react";

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [responseValue, setResponseValue] = useState("");

  const generateResponse = async (newQuestion, setNewQuestion) => {
    showLoader();
    const MODEL_NAME = "gemini-pro";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.4,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const parts = [{ text: newQuestion }];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    }).catch(() => {
      alert('Too Many Request in Given Time, Please Try Again.')
      hideLoader();
    });

    const response = result.response;
    console.log(response.text());
    if (response.text()) {
      setResponseValue([
        {
          question: newQuestion,
          answer: response.text(),
        },
        ...responseValue,
      ]);
      setNewQuestion("");
      hideLoader();
      window.scrollTo({ top: window.innerHeight - 50, behavior: "smooth" });
    } else {
      alert("An Error Occur");
    }
  };

  function showLoader() {
    let spinner = document.querySelector(".spinner");
    spinner.style.display = "block";
  }

  function hideLoader() {
    let spinner = document.querySelector(".spinner");
    spinner.style.display = "none";
  }

  return (
    <div>
      <div className="header-section">
        <h1>Google Gemini-Pro 🤖</h1>
        <p>
          Hello! I'm an AI chatbot powered by the latest Gemini-Pro AI model
          from Google. I'm here to assist you with your queries. Feel free to
          ask anything, and I'll provide the best answers I can. Please keep in
          mind that I operate based on set rules and may not grasp everything
          like a human would.
        </p>
      </div>

      <FormSection generateResponse={generateResponse} />
      <AnswerSection responseValue={responseValue ? responseValue : []} />
    </div>
  );
}

export default App;
