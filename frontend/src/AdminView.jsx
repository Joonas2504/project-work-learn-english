// Import necessary hooks and axios for API calls
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

/**
 * AdminView component for managing word pairs.
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.onLogout - The function to call when logging out.
 * @returns {JSX.Element} The rendered component.
 */
const AdminView = () => {
  // Define state variables
  const [wordPairs, setWordPairs] = useState([]); // Holds the word pairs fetched from the API
  const [newFinnishWord, setNewFinnishWord] = useState(""); // Holds the new Finnish word to be added
  const [newEnglishWord, setNewEnglishWord] = useState(""); // Holds the new English word to be added
  const [updateId, setUpdateId] = useState({ id: "", index: -1 }); // Holds the id of the word pair to be updated
  const [updateFinnishWord, setUpdateFinnishWord] = useState(""); // Holds the updated Finnish word
  const [updateEnglishWord, setUpdateEnglishWord] = useState(""); // Holds the updated English word
  const [inputId, setInputId] = useState(""); // Holds the input ID for fetching a word pair
  const [deleteWordPair, setDeleteWordPair] = useState(""); // Holds the word pair to be deleted
  const [deleteId, setDeleteId] = useState(""); // Holds the ID of the word pair to be deleted
  const [showWordPairs, setShowWordPairs] = useState(false);

  /**
   * Fetches word pairs from the API when showWordPairs changes to true.
   * @function
   * @async
   * @param {boolean} showWordPairs - Indicates whether to fetch and display word pairs.
   */
  useEffect(() => {
    const fetchData = async () => {
      if (showWordPairs) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/word-pairs`
          );
          setWordPairs(response.data); // Update the wordPairs state with the fetched data
        } catch (error) {
          console.error("Error fetching word pairs:", error);
        }
      }
    };

    fetchData();
  }, [showWordPairs]); // Dependency array includes showWordPairs

  /**
   * Fetches a word pair when updateId.id changes.
   * @function
   * @async
   * @param {Object} updateId - The object containing the id and index of the word pair to be updated.
   */
  useEffect(() => {
    const fetchWordPair = async () => {
      if (updateId.id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/word-pairs/${updateId.id}`
          );
          setUpdateFinnishWord(response.data.finnish_word); // Update the Finnish word to be updated
          setUpdateEnglishWord(response.data.english_word); // Update the English word to be updated
        } catch (error) {
          console.error("Error fetching word pair:", error);
        }
      }
    };

    fetchWordPair();
  }, [updateId.id]); // Only trigger the effect when updateId.id changes

  /**
   * Handles the Add Word Pair button click.
   * @function
   * @async
   */
  const handleAddWordPair = async () => {
    // Check if the new Finnish or English word is empty
    if (!newFinnishWord || !newEnglishWord) {
      alert("Please enter a Finnish and English word.");
      return; // Do not add the pair to the list if either word is empty
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
      return; // Do not add the pair to the list if it already exists
    }

    // Try to add the new word pair to the database
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/word-pairs`,
        {
          finnish_word: newFinnishWord,
          english_word: newEnglishWord,
        }
      );
      console.log(response.data); // Log the response data

      // Add the new word pair to the wordPairs state
      setWordPairs([...wordPairs, response.data]);
      alert(
        `Word pair "${newFinnishWord} - ${newEnglishWord}" added successfully.`
      );
      // Clear the new Finnish and English word input fields
      setNewFinnishWord("");
      setNewEnglishWord("");
    } catch (error) {
      console.error("Error adding word pair:", error); // Log any error that occurs during the process
    }
  };

  /**
   * Fetches a word pair by its ID.
   * @function
   * @async
   */
  const handleFetchById = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/word-pairs/${inputId}`
      );

      // If the word pair is found, set it in the state for display
      setUpdateFinnishWord(response.data.finnish_word);
      setUpdateEnglishWord(response.data.english_word);
      setUpdateId({ id: inputId, index: -1 }); // Set the ID and index of the word pair to be updated
    } catch (error) {
      console.error(`Error fetching word pair with id ${inputId}:`, error); // Log any error that occurs during the process
      // If the word pair is not found, reset the state
      // Inform the user that the ID is not found
      alert(`No word pair found with ID ${inputId}.`);
    }
  };

  /**
   * Handles the update of a word pair.
   * @function
   * @async
   */
  const handleUpdateWordPair = async () => {
    // Check if the updated Finnish or English word is empty
    if (!updateFinnishWord || !updateEnglishWord) {
      alert("Please enter an updated Finnish and English word.");
      return; // If either word is empty, do not proceed with the update
    }

    // Check if the updated pair is already in the list (case-insensitive)
    const isPairInList = wordPairs.some(
      (pair) =>
        pair.finnish_word.toLowerCase() === updateFinnishWord.toLowerCase() &&
        pair.english_word.toLowerCase() === updateEnglishWord.toLowerCase()
    );

    if (isPairInList) {
      // If the updated pair already exists in the list, inform the user and do not proceed with the update
      alert(
        `Updated word pair "${updateFinnishWord} - ${updateEnglishWord}" already exists.`
      );
      return;
    }

    // If the updated pair is not already in the list, proceed with the update
    try {
      // Send a PUT request to the server to update the word pair
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/word-pairs/${updateId.id}`,
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

      // Update the wordPairs state with the updated word pair.
      setWordPairs((prevWordPairs) =>
        prevWordPairs.map((pair, index) =>
          index === updateId.index ? response.data : pair
        )
      );

      // Fetch the updated list of word pairs from the server
      const updatedWordPairs = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/word-pairs`
      );
      setInputId(""); // Reset the inputId state
      // Update the wordPairs state with the updated list
      setWordPairs(updatedWordPairs.data);
      alert("Updated word pair succesfully.");
      // Reset the updateFinnishWord, updateEnglishWord, and updateId states
      setUpdateFinnishWord("");
      setUpdateEnglishWord("");
      setUpdateId({ id: "", index: -1 });
    } catch (error) {
      // If an error occurs during the update, log it to the console
      console.error("Error updating word pair:", error);
    }
  };

  /**
   * Handles the fetch of a word pair for deletion.
   * @function
   * @async
   */
  const handleFetchForDelete = async () => {
    try {
      // Send a GET request to the server to fetch the word pair
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/word-pairs/${deleteId}`
      );

      // If the word pair is found, set it in the deleteWordPair state
      setDeleteWordPair(response.data);
    } catch (error) {
      // If an error occurs during the fetch, log it to the console
      console.error(`Error fetching word pair with id ${deleteId}:`, error);
      // If the word pair is not found, reset the deleteWordPair state and inform the user
      setDeleteWordPair(null);
      alert(`No word pair found with ID ${deleteId}.`);
    }
  };

  /**
   * Handles the deletion of a word pair.
   * @function
   * @async
   */
  const handleDeleteWordPair = async () => {
    // Check if a word pair has been fetched for deletion
    if (!deleteWordPair || !deleteWordPair.id) {
      alert("Please fetch a word pair by ID first.");
      return; // If no word pair has been fetched, do not proceed with the deletion
    }

    try {
      // Send a DELETE request to the server to delete the word pair
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/word-pairs/${deleteWordPair.id}`
      );
      console.log(response.data); // Log the response data

      // Inform the user that the word pair has been deleted
      alert(
        `Word pair deleted: "${deleteWordPair.finnish_word} - ${deleteWordPair.english_word}"`
      );

      // Reset the deleteWordPair state after a successful deletion
      setDeleteWordPair("");
      setDeleteId("");

      // Fetch the updated list of word pairs from the server
      const updatedWordPairs = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/word-pairs`
      );
      // Update the wordPairs state with the updated list
      setWordPairs(updatedWordPairs.data);
    } catch (error) {
      // If an error occurs during the deletion, log it to the console
      console.error("Error deleting word pair:", error);
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
      {/* Button to fetch the word pair by ID */}
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

      <br />

      {/* Input field for the ID of the word pair to be deleted */}
      <input
        type="text"
        value={deleteId}
        onChange={(e) => setDeleteId(e.target.value)}
      />
      {/* Button to fetch the word pair by ID for deletion */}
      <button onClick={handleFetchForDelete}>Fetch by ID</button>
      {/* Read-only input field to display the fetched word pair */}
      <input
        type="text"
        value={
          deleteWordPair
            ? `${deleteWordPair.finnish_word} - ${deleteWordPair.english_word}`
            : "Fetch word pair by ID first."
        }
        readOnly
      />
      {/* Button to delete the fetched word pair */}
      <button onClick={handleDeleteWordPair} disabled={!deleteWordPair}>
        Delete Word Pair
      </button>

      <br />

      {/* Button to set showWordPairs to true */}
      <button onClick={() => setShowWordPairs(true)}>Fetch All Words</button>
      <button onClick={() => setShowWordPairs(false)}>Hide Words</button>

      {/* Table to display the word pairs, only if showWordPairs is true */}
      {showWordPairs && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Finnish Word</th>
              <th>English Word</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through the wordPairs array and create a table row for each word pair */}
            {wordPairs.map((pair) => (
              <tr key={pair.id}>
                <td>{pair.id}</td>
                <td>{pair.finnish_word}</td>
                <td>{pair.english_word}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

AdminView.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminView;
