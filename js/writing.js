// scripts/writing.js

document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("writing-textarea");
  const wordCountDisplay = document.getElementById("word-count");
  const maxWords = 500;

  textarea.addEventListener("input", updateWordCount);

  function updateWordCount() {
    const text = textarea.value.trim();
    let wordCount = 0;

    if (text.length > 0) {
      // Split the text by spaces, newlines, or tabs
      const words = text.split(/\s+/);
      wordCount = words.length;
    }

    if (wordCount > maxWords) {
      wordCountDisplay.style.color = "red";
      wordCountDisplay.textContent = `${wordCount}/${maxWords} words (Limit exceeded!)`;
    } else {
      wordCountDisplay.style.color = "black";
      wordCountDisplay.textContent = `${wordCount}/${maxWords} words`;
    }
  }
});
