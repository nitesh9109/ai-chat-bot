import React, { useState } from "react";

function FormSection({ generateResponse }) {
  const [newQuestion, setNewQuestion] = useState("");

  function handleKeyDown(e) {
    if (e.key == "Enter") {
      e.preventDefault();
      generateResponse(newQuestion, setNewQuestion);
      setNewQuestion("");
    }
  }

  function handleExampleInput(text) {
    const updatedQuestion = text;
    setNewQuestion(updatedQuestion);
    generateResponse(updatedQuestion, setNewQuestion);
  }

  return (
    <div className="form-section">
      <textarea
        className="form-control"
        placeholder="Ask Me Anything....."
        rows="5"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
      ></textarea>

      <button
        className="btn"
        onClick={() => generateResponse(newQuestion, setNewQuestion)}
      >
        Generate Response 🤖
      </button>
      <div className="examples">
        <div
          className="div-examples"
          onClick={() =>
            handleExampleInput("Tell me a fun fact about the roman empire")
          }
        >
          <h4>Tell me a fun fact</h4>
          <p>about the Roman Empire</p>
        </div>
        <div
          className="div-examples"
          onClick={() =>
            handleExampleInput(
              "how to make HTTP request using Javascript language."
            )
          }
        >
          <h4>How to make HTTP request</h4>
          <p>using Javascript langauge</p>
        </div>
      </div>
    </div>
  );
}

export default FormSection;
