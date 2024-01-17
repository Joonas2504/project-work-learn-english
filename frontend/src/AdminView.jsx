// Import necessary hooks and axios for API calls
import { useState, useEffect } from "react";
import axios from "axios";

// Define the AdminView component
const AdminView = () => {
  // Define state variables
  const [wordPairs, setWordPairs] = useState([]); // Holds the word pairs fetched from the API
  const [newFinnishWord, setNewFinnishWord] = useState(""); // Holds the new Finnish word to be added
  const [newEnglishWord, setNewEnglishWord] = useState(""); // Holds the new English word to be added

  // Fetch word pairs from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/word-pairs"
        );
        setWordPairs(response.data); // Update the wordPairs state with the fetched data
      } catch (error) {
        console.error("Error fetching word pairs:", error);
      }
    };

    fetchData();
  }, []);

  // Handle the Add Word Pair button click
  const handleAddWordPair = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/word-pairs",
        {
          finnish_word: newFinnishWord,
          english_word: newEnglishWord,
        }
      );
      setWordPairs([...wordPairs, response.data]); // Add the new word pair to the wordPairs state
      setNewFinnishWord(""); // Clear the new Finnish word input field
      setNewEnglishWord(""); // Clear the new English word input field
    } catch (error) {
      console.error("Error adding word pair:", error);
    }
  };
  return (
    <div>
      <h1>Admin View</h1>
      {/* Input fields for the new word pair */}
      <input
        type="text"
        value={newFinnishWord}
        onChange={(event) => setNewFinnishWord(event.target.value)}
        placeholder="New Finnish word"
      />
      <input
        type="text"
        value={newEnglishWord}
        onChange={(event) => setNewEnglishWord(event.target.value)}
        placeholder="New English word"
      />
      {/* Button to add the new word pair */}
      <button onClick={handleAddWordPair}>Add Word Pair</button>

      {/* Table to display the word pairs */}
      <table>
        <thead>
          <tr>
            <th>English Word</th>
            <th>Finnish Word</th>
          </tr>
        </thead>
        <tbody>
          {wordPairs.map((pair) => (
            <tr key={pair.id}>
              <td>{pair.english_word}</td>
              <td>{pair.finnish_word}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;
