// Import necessary hooks and axios for API calls
import { useState, useEffect } from "react";
import axios from "axios";

// Define the AdminView component
const AdminView = () => {
  // Define state variables
  const [wordPairs, setWordPairs] = useState([]); // Holds the word pairs fetched from the API
  const [newFinnishWord, setNewFinnishWord] = useState(""); // Holds the new Finnish word to be added
  const [newEnglishWord, setNewEnglishWord] = useState(""); // Holds the new English word to be added
  const [updateId, setUpdateId] = useState({ id: "", index: -1 }); // Holds the id of the word pair to be updated
  const [updateFinnishWord, setUpdateFinnishWord] = useState("");
  const [updateEnglishWord, setUpdateEnglishWord] = useState("");
  const [inputId, setInputId] = useState("");

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

  useEffect(() => {
    const fetchWordPair = async () => {
      if (updateId.id) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/word-pairs/${updateId.id}`
          );
          setUpdateFinnishWord(response.data.finnish_word);
          setUpdateEnglishWord(response.data.english_word);
        } catch (error) {
          console.error("Error fetching word pair:", error);
        }
      }
    };

    fetchWordPair();
  }, [updateId.id]); // Only trigger the effect when updateId.id changes

  // Handle the Add Word Pair button click
  const handleAddWordPair = async () => {
    // Check if the new Finnish or English word is empty
    if (!newFinnishWord || !newEnglishWord) {
      alert("Please enter a Finnish and English word.");
      return; // Do not add the pair to the list
    }

    // Check if the pair is already in the list (case-insensitive)
    const isPairInList = wordPairs.some(
      (pair) =>
        pair.finnish_word.toLowerCase() === newFinnishWord.toLowerCase() ||
        pair.english_word.toLowerCase() === newEnglishWord.toLowerCase()
    );

    if (isPairInList) {
      // Display a message to the user that the pair already exists
      alert(
        `Word pair "${newFinnishWord} - ${newEnglishWord}" already exists.`
      );
      return; // Do not add the pair to the list
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/word-pairs",
        {
          finnish_word: newFinnishWord,
          english_word: newEnglishWord,
        }
      );
      console.log(response.data); // Log the response data

      // Add the new word pair to the wordPairs state
      setWordPairs([...wordPairs, response.data]);
      // Clear the new Finnish and English word input fields
      setNewFinnishWord("");
      setNewEnglishWord("");
    } catch (error) {
      console.error("Error adding word pair:", error);
    }
  };

  const handleFetchById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/word-pairs/${inputId}`
      );
      // Set the updateFinnishWord and updateEnglishWord states with the fetched data
      setUpdateFinnishWord(response.data.finnish_word);
      setUpdateEnglishWord(response.data.english_word);
      setUpdateId({ id: inputId, index: -1 }); // Set index to an appropriate value based on your logic
    } catch (error) {
      console.error(`Error fetching word pair with id ${inputId}:`);
      // Handle error: display a message to the user
      alert(`Error fetching word pair with id ${inputId}: ${error.message}`);
    }
  };

  const handleUpdateWordPair = async () => {
    // Check if the updated Finnish or English word is empty
    if (!updateFinnishWord || !updateEnglishWord) {
      alert("Please enter an updated Finnish and English word.");
      return; // Do not update the pair
    }

    // Check if the updated pair is already in the list (case-insensitive)
    const isPairInList = wordPairs.some(
      (pair) =>
        pair.finnish_word.toLowerCase() === updateFinnishWord.toLowerCase() ||
        pair.english_word.toLowerCase() === updateEnglishWord.toLowerCase()
    );

    if (isPairInList) {
      // Display a message to the user that the updated pair already exists
      alert(
        `Updated word pair "${updateFinnishWord} - ${updateEnglishWord}" already exists.`
      );
      return; // Do not update the pair
    }

    // Continue with the update logic
    try {
      const response = await axios.put(
        `http://localhost:8080/api/word-pairs/${updateId.id}`,
        {
          finnish_word: updateFinnishWord,
          english_word: updateEnglishWord,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setWordPairs((prevWordPairs) =>
        prevWordPairs.map((pair, index) =>
          index === updateId.index ? response.data : pair
        )
      );

      // Update the word pairs immediately after a successful update
      const updatedWordPairs = await axios.get(
        "http://localhost:8080/api/word-pairs"
      );
      setWordPairs(updatedWordPairs.data);

      setUpdateFinnishWord("");
      setUpdateEnglishWord("");
      setUpdateId({ id: "", index: -1 }); // Reset updateId
    } catch (error) {
      console.error("Error updating word pair:", error);
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
      <br />
      {/* Input field for the ID of the word pair to be updated */}

      <input
        type="text"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
      />
      <button onClick={handleFetchById}>Fetch by ID</button>
      {/* Input fields for the updated word pair */}
      <input
        type="text"
        value={updateFinnishWord}
        onChange={(event) => setUpdateFinnishWord(event.target.value)}
        placeholder="Updated Finnish word"
      />
      <input
        type="text"
        value={updateEnglishWord}
        onChange={(event) => setUpdateEnglishWord(event.target.value)}
        placeholder="Updated English word"
      />
      {/* Button to update the word pair */}
      <button onClick={() => handleUpdateWordPair(updateId.id)}>Update</button>
      {/* Table to display the word pairs */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Finnish Word</th>
            <th>English Word</th>
          </tr>
        </thead>
        <tbody>
          {wordPairs.map((pair) => (
            <tr key={pair.id}>
              <td>{pair.id}</td>
              <td>{pair.finnish_word}</td>
              <td>{pair.english_word}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;
