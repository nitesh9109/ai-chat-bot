import FormSection from "./Components/FormSection";
import AnswerSection from "./Components/AnswerSection";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "./App.css";
// import "highlight.js/styles/github-dark.css";
import "highlight.js/styles/stackoverflow-dark.css";

function App() {
  const [responseValue, setResponseValue] = useState([]);
  const [textResponse, setTextResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    hljs.highlightAll();
  }, [responseValue]);

  const generateResponse = async (newQuestion, setNewQuestion) => {
    if (isRunning) {
      alert("A request is already in progress. Please wait.");
      return;
    }

    setIsRunning(true);

    const API_KEY = import.meta.env.VITE_API_KEY;
    const MODEL_NAME = "gemini-pro";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    };

    const parts = newQuestion;

    setIsLoading(true);

    const chat = model.startChat({
      history,
      generationConfig,
    });

    try {
      const result = await chat.sendMessageStream(parts);

      let rawText = "";
      let scrollTop = 100;
      setIsLoading(false);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        rawText += chunkText;

        setResponseValue([
          {
            question: parts,
            answer: marked.parse(rawText),
          },
          ...responseValue,
        ]);

        window.scrollTo({ top: (scrollTop += 200), behavior: "smooth" });
      }

      setNewQuestion("");
      window.scrollTo({ top: (scrollTop += 100), behavior: "smooth" });
      setTextResponse(rawText);

      // Pushing history for multi-turn conversation
      // history.push({ role: "user", parts }, { role: "model", parts: rawText });
      setHistory([
        ...history,
        { role: "user", parts },
        { role: "model", parts: rawText },
      ]);
      setIsRunning(false);
    } catch (error) {
      alert("Too many requests within the given time. Please try again.");
      console.error("Error occured: ", error);
      setIsLoading(false);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <div className="main">
        <div className={`spinner ${isLoading ? "show" : ""}`}></div>
      </div>
      <div id="main-box">
        <div className="header-section">
          <div className="img img-container">
            <a href="https://makersuite.google.com" target="_blank">
              <img className="rotate-img" src="/google-ai-1.svg" alt="" />
            </a>
          </div>
          <h1>🤖 How Can I Help You Today? 🤖</h1>
        </div>
        <FormSection generateResponse={generateResponse} />
        <AnswerSection
          textResponse={textResponse}
          responseValue={responseValue}
        />
        <hr className="hr-line" />
        <p id="author">
          Made By NiteshNagar{" "}
          <a href="https://github.com/nitesh9109/ai-chat-bot" target="_blank">
            Source Code
          </a>
        </p>
      </div>
    </>
  );
}

export default App;
