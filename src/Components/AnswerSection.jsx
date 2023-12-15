import React from "react";

function AnswerSection({ responseValue }) {
  function copyText(text) {
    window.navigator.clipboard.writeText(text);
  }

  return (
    <>
      <hr className="hr-line" />
      <div className="answer-container">
        {responseValue.map((value, index) => {
          let transformedText = value.answer.replace(
            /\*\*(.*?)\*\*/g,
            "<br/><br/><h4>$1</h4>"
          );

          transformedText = transformedText.replace(/\*/g, "");
          // transformedText = transformedText.replace(/(\d+\.)\s/g, '<br/>$1 ');
          transformedText = transformedText.replace(
            /```([\s\S]*?)```/g,
            "<pre>$1</pre>"
          );

          let firstOccurrence = true;
          transformedText = transformedText.replace(
            /(\d+\.)\s/g,
            (match, group) => {
              if (firstOccurrence) {
                firstOccurrence = false;
                return match;
              } else {
                return "<br/>" + group + " ";
              }
            }
          );

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
