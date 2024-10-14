import { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from './Notification'; // Import the Notification component

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [notification, setNotification] = useState(''); // State for notification message

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = { name: newName, number: newNumber };

    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    axios
      .post('http://localhost:3001/persons', personObject)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');
        setNotification(`Added ${response.data.name}`); 
        setTimeout(() => {
          setNotification('');
        }, 4000);
      });
  };

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this persons number?')) {
      axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} /> {/* Display the notification */}

      <PersonForm  
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDeleteClick(person.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

const PersonForm = ({ addPerson, newName, handlePersonChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default App;