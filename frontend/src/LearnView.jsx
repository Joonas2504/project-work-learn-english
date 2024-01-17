import { useState, useEffect } from "react";
import axios from "axios";

const LearnView = () => {
  const [wordPairs, setWordPairs] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInputs, setUserInputs] = useState(Array(10).fill(""));
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [languageMode, setLanguageMode] = useState("fi"); // Default to Finnish
  const [checkedAnswers, setCheckedAnswers] = useState(Array(10).fill(false));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/word-pairs"
        );
        setWordPairs(response.data);
      } catch (error) {
        console.error("Error fetching word pairs:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (index, event) => {
    const newInputs = [...userInputs];
    newInputs[index] = event.target.value;
    setUserInputs(newInputs);
  };

  const handleCheckAnswer = (index) => {
    if (checkedAnswers[index]) {
      return;
    }

    const currentPair = wordPairs[currentWordIndex + index];
    const correctAnswer =
      languageMode === "fi"
        ? currentPair.english_word
        : currentPair.finnish_word;

    if (userInputs[index].toLowerCase() === correctAnswer.toLowerCase()) {
      setScore(score + 1);
      setFeedback("Correct!");

      const newCheckedAnswers = [...checkedAnswers];
      newCheckedAnswers[index] = true;
      setCheckedAnswers(newCheckedAnswers);
    } else {
      setFeedback("Incorrect. Try again!");

      // Reset user input and feedback after a brief delay
      setTimeout(() => {
        const newInputs = [...userInputs];
        newInputs[index] = ""; // Clear only the incorrect answer
        setUserInputs(newInputs);
        setFeedback("");
      }, 1000);
    }
  };

  const handleGenerateNewWords = () => {
    // Logic to generate new words goes here
    // For now, let's just fetch the next set of words
    const newCurrentIndex = currentWordIndex + 10;
    setCurrentWordIndex(
      newCurrentIndex < wordPairs.length ? newCurrentIndex : 0
    );

    // Reset user input and feedback
    setUserInputs(Array(10).fill(""));
    setFeedback("");
    setCheckedAnswers(Array(10).fill(false));
  };

  const handleSwitchLanguage = () => {
    setLanguageMode((prevMode) => (prevMode === "fi" ? "en" : "fi"));
  };

  // Display ten words at once
  const wordsToDisplay = wordPairs.slice(
    currentWordIndex,
    currentWordIndex + 10
  );

  return (
    <div>
      <h1>Learn Words</h1>
      {wordsToDisplay.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>{languageMode === "fi" ? "Finnish" : "English"}</th>
              <th>Answer</th>
              <th>Check</th>
            </tr>
          </thead>
          <tbody>
            {wordsToDisplay.map((pair, index) => (
              <tr key={index}>
                <td>
                  {languageMode === "fi"
                    ? pair.finnish_word
                    : pair.english_word}
                </td>
                <td>
                  <input
                    type="text"
                    value={userInputs[index]}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
                <td>
                  <button onClick={() => handleCheckAnswer(index)}>
                    Check Answer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleGenerateNewWords}>Generate New Words</button>
      <button onClick={handleSwitchLanguage}>
        Switch to {languageMode === "fi" ? "English" : "Finnish"}
      </button>
      <p>Score: {score}</p>
      {feedback && <p>{feedback}</p>}
      {currentWordIndex >= wordPairs.length && (
        <p>Congratulations! You have completed the word pairs.</p>
      )}
    </div>
  );
};

export default LearnView;
