// Import necessary hooks and axios for API calls
import { useState, useEffect } from "react";
import axios from "axios";

/**
 * LearnView component for the learning page.
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const LearnView = () => {
  // Define state variables
  const [wordPairs, setWordPairs] = useState([]); // Holds the word pairs fetched from the API
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Index of the current word pair
  const [userInputs, setUserInputs] = useState(Array(10).fill("")); // Holds the user's input for each word pair
  const [score, setScore] = useState(0); // Holds the user's score
  const [feedback, setFeedback] = useState(""); // Holds feedback messages
  const [languageMode, setLanguageMode] = useState("fi"); // Holds the current language mode (Finnish or English)
  const [checkedAnswers, setCheckedAnswers] = useState(Array(10).fill(false)); // Holds the checked status of each answer
  const [showCongrats, setShowCongrats] = useState(false); // Holds the status of the congratulations message

  /**
   * Fetches word pairs from the API.
   * @async
   * @function
   * @name fetchData
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/word-pairs`
        );
        setWordPairs(response.data); // Update the wordPairs state with the fetched data
      } catch (error) {
        console.error("Error fetching word pairs:", error);
      }
    };

    fetchData();
  }, []);

  /**
   * Handles changes to the input fields.
   * @function
   * @name handleInputChange
   * @param {number} index - The index of the input field.
   * @param {Event} event - The input change event.
   */
  const handleInputChange = (index, event) => {
    const newInputs = [...userInputs];
    newInputs[index] = event.target.value; // Update the value of the changed input field
    setUserInputs(newInputs); // Update the userInputs state
  };

  /**
   * Handles the Check Answer button click.
   * @function
   * @name handleCheckAnswer
   * @param {number} index - The index of the checked answer.
   */
  const handleCheckAnswer = (index) => {
    if (checkedAnswers[index]) {
      return; // If the answer has already been checked, do nothing
    }

    const currentPair = wordPairs[currentWordIndex + index]; // Get the current word pair
    const correctAnswer =
      languageMode === "fi"
        ? currentPair.english_word
        : currentPair.finnish_word; // Determine the correct answer based on the language mode

    // Check the user's input against the correct answer
    if (userInputs[index].toLowerCase() === correctAnswer.toLowerCase()) {
      setScore(score + 1); // If the answer is correct, increment the score
      setFeedback("Correct!"); // Provide feedback

      const newCheckedAnswers = [...checkedAnswers];
      newCheckedAnswers[index] = true; // Mark the answer as checked
      setCheckedAnswers(newCheckedAnswers); // Update the checkedAnswers state

      // If the score is a multiple of 10, display the congratulations message
      if ((score + 1) % 10 === 0) {
        setShowCongrats(true);
      }
    } else {
      setFeedback("Incorrect. Try again!"); // Provide feedback

      // Reset user input and feedback after a brief delay
      setTimeout(() => {
        const newInputs = [...userInputs];
        newInputs[index] = ""; // Clear only the incorrect answer
        setUserInputs(newInputs); // Update the userInputs state
        setFeedback(""); // Clear the feedback
      }, 1000);
    }
  };

  /**
   * Handles the Generate New Words button click.
   * @function
   * @name handleGenerateNewWords
   */
  const handleGenerateNewWords = () => {
    const newCurrentIndex = currentWordIndex + 10; // Calculate the new current word index
    setCurrentWordIndex(
      newCurrentIndex < wordPairs.length ? newCurrentIndex : 0
    ); // Update the currentWordIndex state, or reset it to 0 if the end of the word pairs list is reached

    // Reset user input and feedback
    setUserInputs(Array(10).fill(""));
    setFeedback("");
    setCheckedAnswers(Array(10).fill(false));
    setShowCongrats(false); // Reset the congratulations message
  };

  /**
   * Handles the Switch Language button click.
   * @function
   * @name handleSwitchLanguage
   */
  const handleSwitchLanguage = () => {
    setLanguageMode((prevMode) => (prevMode === "fi" ? "en" : "fi")); // Switch the language mode

    // Clear the input fields.
    setUserInputs(Array(10).fill(""));
    setCheckedAnswers(Array(10).fill(false));
  };

  // Determine the word pairs to display
  const wordsToDisplay = wordPairs.slice(
    currentWordIndex,
    currentWordIndex + 10
  );

  return (
    <div>
      <h1>Welcome To Learn English</h1>
      <br />
      {/* Display the user's score */}
      <p>Score: {score}</p>
      {/* Button to generate new words */}
      <button onClick={handleGenerateNewWords}>Generate New Words</button>
      {/* Button to switch the language mode */}
      <button onClick={handleSwitchLanguage}>
        Switch to {languageMode === "fi" ? "English" : "Finnish"}
      </button>
      {/* Display feedback if there is any */}
      {feedback && <p>{feedback}</p>}
      {/* Display a congratulations message when the user has answered all word pairs correctly */}
      {showCongrats && (
        <p>Congratulations! You have completed the word pairs.</p>
      )}

      {/* Check if there are words to display */}
      {wordsToDisplay.length > 0 && (
        <table>
          <thead>
            <tr>
              {/* Display the language mode */}
              <th>{languageMode === "fi" ? "Finnish" : "English"}</th>
              <th>Answer</th>
              <th>Check</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through the words to display */}
            {wordsToDisplay.map((pair, index) => (
              <tr key={index}>
                <td>
                  {/* Display the word in the current language mode */}
                  {languageMode === "fi"
                    ? pair.finnish_word
                    : pair.english_word}
                </td>
                <td>
                  {/* Input field for the user's answer */}
                  <input
                    type="text"
                    value={userInputs[index]}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
                <td>
                  {/* Button to check the user's answer */}
                  <button onClick={() => handleCheckAnswer(index)}>
                    Check Answer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LearnView;
