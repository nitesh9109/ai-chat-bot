import React from "react";

function AnswerSection({ responseValue }) {
  function copyText(text) {
    window.navigator.clipboard.writeText(text);
  }

  function transformedTextFunction(text) {
    let transformedText = text.answer.replace(
      /\* \*\*(.*?)\*\*/g,
      "<h4>$1</h4>"
    );

    transformedText = transformedText.replace(/\*\*(.*?)\*\*/g, "<h5>$1</h5>");

    transformedText = transformedText.replace(/(\d+\.)\s/g, "<br/>$1 ");
    transformedText = transformedText.replace(
      /```([\s\S]*?)```/g,
      "<pre>$1</pre>"
    );

    let firstOccurrence = true;
    transformedText = transformedText.replace(/(\d+\.)\s/g, (match, group) => {
      if (firstOccurrence) {
        firstOccurrence = false;
        return match;
      } else {
        return "<br/>" + group + " ";
      }
    });

    return transformedText;
  }

  return (
    <>
      <hr className="hr-line" />
      <div className="answer-container">
        {responseValue.map((value, index) => {
          let transformedText = transformedTextFunction(value);
          return (
            <div className="answer-section" key={index}>
              <div className="question">{value.question}</div>
              <div
                className="answer"
                dangerouslySetInnerHTML={{ __html: transformedText }}
              ></div>
              <div onClick={() => copyText(value.answer)} className="copy-icon">
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
