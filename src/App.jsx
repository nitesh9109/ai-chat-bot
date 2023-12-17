import FormSection from "./Components/FormSection";
import AnswerSection from "./Components/AnswerSection";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "./App.css";
import "highlight.js/styles/github-dark.css";
// import "highlight.js/styles/stackoverflow-dark.css";

let isRunning = true;

function App() {
  const [responseValue, setResponseValue] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    hljs.highlightAll();
  }, [responseValue]);

  const generateResponse = async (newQuestion, setNewQuestion) => {
    showLoader();
    const API_KEY = import.meta.env.VITE_API_KEY;
    const MODEL_NAME = "gemini-pro";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.4,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    };

    const parts = [{ text: newQuestion }];

    if (isRunning) {
      isRunning = false;
      const result = await model
        .generateContentStream({
          contents: [{ role: "user", parts }],
          generationConfig,
        })
        .catch(() => {
          alert("Too Many Request in Given Time, Please Try Again.");
          hideLoader();
        });

      let rawText = "";

      hideLoader();
      let x = 100;
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        rawText += chunkText;
        setResponseValue([
          {
            question: newQuestion,
            answer: marked.parse(rawText),
          },
          ...responseValue,
        ]);
        window.scrollTo({ top: (x += 200), behavior: "smooth" });
      }
      setNewQuestion("");
      isRunning = true;
      window.scrollTo({ top: (x += 100), behavior: "smooth" });
    } else {
      alert("Too Many Request At One Time.");
      hideLoader();
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
    <div id="main-box" ref={containerRef}>
      <div className="header-section">
        <div className="img img-container">
          <img className="rotate-img" src="/google-ai-1.svg" alt="" />
        </div>
        <h1>🤖 How Can I Help You Today? 🤖</h1>
      </div>
      <FormSection generateResponse={generateResponse} />
      <AnswerSection responseValue={responseValue ? responseValue : []} />
    </div>
  );
}

export default App;
