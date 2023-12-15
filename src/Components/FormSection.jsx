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
    </div>
  );
}

export default FormSection;
