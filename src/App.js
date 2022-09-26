import { useEffect, useState } from 'react';

function App() {
  const baseUrl = 'http://localhost:4000';

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setFirstName('');
    setLastName('');
  };

  // Getting all guests from API:
  async function getAllGuest() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
  }

  // create new guest:
  async function createNewGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: 'Karl', lastName: 'Horky' }),
    });
    const createdGuest = await response.json();
  }

  // update guest:
  async function updateGuest() {
    const response = await fetch(`${baseUrl}/guests/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
    const updatedGuest = await response.json();
  }

  // delete guest:
  async function deleteGuest() {
    const response = await fetch(`${baseUrl}/guests/1`, { method: 'DELETE' });
    const deletedGuest = await response.json();
  }

  return (
    <div className="App">
      <h2>Enter Guest Info:</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <br />
        <label>
          Last Name:
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(event) => {
              setLastName(event.currentTarget.value);
            }}
            onKeyPress={async (event) =>
              event.key === 'Enter' ? await createNewGuest() : null
            }
          />
          <button onClick={handleSubmit}> Add Guest </button>
          {console.log({ lastName })};
        </label>
      </form>
      <div>
        <h2>Guest List</h2>
      </div>
    </div>
  );
}

export default App;
