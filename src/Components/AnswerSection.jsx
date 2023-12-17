import React from "react";

function AnswerSection({ responseValue ,textResponse}) {
  function copyText(text) {
    window.navigator.clipboard.writeText(text);
  }

  return (
    <>
      <hr className="hr-line" />
      <div className="answer-container">
        {responseValue.map((value, index) => {
          let transformedText = value.answer;
          return (
            <div className="answer-section" key={index}>
              <div className="question">{value.question}</div>
              <div
                className="answer"
                dangerouslySetInnerHTML={{ __html: transformedText }}
              ></div>
              <div onClick={() => copyText(textResponse)} className="copy-icon">
                <i className="fa-solid fa-copy"></i>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AnswerSection;
