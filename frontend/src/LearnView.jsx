// LearnView.js

import { useState, useEffect } from "react";
import axios from "axios";

const LearnView = () => {
  const [wordPairs, setWordPairs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Fetch word pairs from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/word-pairs");
        setWordPairs(response.data);
      } catch (error) {
        console.error("Error fetching word pairs:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleCheckAnswer = () => {
    const currentPair = wordPairs[currentIndex];
    if (userInput.toLowerCase() === currentPair.english_word.toLowerCase()) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect. Try again!");
    }

    // Move to the next word pair
    setCurrentIndex(currentIndex + 1);

    // Reset user input and feedback after a brief delay
    setTimeout(() => {
      setUserInput("");
      setFeedback("");
    }, 1000);
  };

  return (
    <div>
      <h1>Learn Words</h1>
      {wordPairs.length > 0 && currentIndex < wordPairs.length && (
        <div>
          <p>
            Finnish Word:{" "}
            <strong>{wordPairs[currentIndex].finnish_word}</strong>
          </p>
          <label>
            Your Answer:
            <input type="text" value={userInput} onChange={handleInputChange} />
          </label>
          <button onClick={handleCheckAnswer}>Check Answer</button>
          <p>Score: {score}</p>
          {feedback && <p>{feedback}</p>}
        </div>
      )}
      {currentIndex === wordPairs.length && (
        <p>Congratulations! You have completed the word pairs.</p>
      )}
    </div>
  );
};

export default LearnView;
