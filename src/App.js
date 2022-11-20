import { useEffect, useRef, useState } from 'react';

function App() {
  const baseUrl = 'http://localhost:3000';

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [guests, setGuests] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(true);

  const ref = useRef(null);

  // call API function getAllGuests on first load:

  useEffect(() => {
    async function getAllGuests() {
      const response = await fetch(baseUrl);
      const res = await response.json();
      setGuests(res);
      setIsLoading(false);
      console.log('fetch complete');
    }

    // (err) => {
    //   setIsLoading(false);
    //   setInputDisabled(false);
    //   console.log(err);
    // },
    // );

    getAllGuests();
  }, []);

  // create new guest, send information to API and add him to list:
  const createNewGuest = async () => {
    const response = await fetch(baseUrl, {
      // post method used to submit forms to the server:
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // convert JavaScript value to Json string
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
      // ask again why we add these variables here.
    });

    setFirstName('');
    setLastName('');
    // here we await the response from what the user typed in and sent to the api:
    const createdGuest = await response.json();
    console.log(createdGuest);
    // here we create an updatedguest variable that we define as an array to which we add the guests variable which we previously determined to be an empty array. using the spread article we add the updatedguest value to the guests variable:
    // const updatedGuests = [...guests];
    // now to bring it all together we add the body to the updated Guest variable.
    // updatedGuests.push(createdGuest);
    // in a final step, we set the guests value to that of the updated guests including the newly created guest:
    // setGuests(updatedGuests);
    // or simpler:
    setGuests([...guests, createdGuest]);
  };

  async function handleEnter(event) {
    if (event.key === 'Enter') {
      await createNewGuest();
      ref.current.focus();
    }
  }

  // update guest to set attending with checkbox:
  const setGuestStatus = async (guest) => {
    const response = await fetch(`${baseUrl}/${guest.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: guest.attending }),
    });

    // here we assign the response we get to the variable updatedGuest, over which we then map over:
    const updatedGuest = await response.json();
    // same as above, using the spread operator entering the information from the update to the array:
    let newGuestArray = [...guests];
    newGuestArray = newGuestArray.map((guest) =>
      guest.id === updatedGuest.id
        ? Object.assign(guest, { attending: true })
        : guest,
    );
    setGuests(newGuestArray);
  };
  // alert('Your guest is set to attending.');

  // delete guest:
  async function deleteGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const guestRest = guests.filter((guest) => {
      return guest.id !== deletedGuest.id;
    });
    setGuests(guestRest);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (!firstName || !lastName) {
      alert('please enter guest info');
      return;
    }
    createNewGuest((firstName, lastName));

    setFirstName('');
    setLastName('');
    // setAttending(false);
  };

  return (
    <div className="App">
      <h2>Enter Guest Info:</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="First Name"
          type="text"
          id="firstName"
          value={firstName}
          onClick={() => setFirstName('')}
          onChange={(event) => {
            setFirstName(event.currentTarget.value);
          }}
          onKeyPress={handleEnter}
        />

        <br />
        <br />

        <input
          placeholder="Last Name"
          type="text"
          id="lastName"
          value={lastName}
          onChange={(event) => {
            setLastName(event.currentTarget.value);
          }}
          onClick={() => setLastName('')}
          onKeyPress={handleEnter}
        />
        <button>Add Guest</button>
      </form>
      <div>
        <h2>Guest List</h2>
        {guests.map((guest) => {
          return (
            <div key={guests.id} data-test-id="guest">
              <span>
                {guest.firstName} {guest.lastName}
              </span>
              {/*  checkbox attend / won't attend */}
              <div>
                <input
                  aria-label={`attending status of ${guests.firstName} ${guests.lastName}`}
                  checked={guests.attending}
                  type="checkbox"
                  onChange={(event) =>
                    setGuestStatus(guest.id, event.currentTarget.checked)
                  }
                />
              </div>

              {/* // Delete button: */}
              <button
                aria-label={`Remove ${guests.firstName} ${guests.lastName}`}
                onClick={async () => {
                  await deleteGuest(guest.id);
                }}
              >
                {' '}
                Delete{' '}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default App;
