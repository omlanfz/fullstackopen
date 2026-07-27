import { useState, useEffect } from "react";
import PersonEntry from "./components/PersonEntry";
import personService from "./service/personService";
import "./index.css";

const Notification = ({ message, type }) => {
  if (!message) return null;
  return <div className={type}>{message}</div>;
};

const SearchFilter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
);

const ContactForm = ({
  onSubmit,
  nameVal,
  onNameChange,
  numberVal,
  onNumberChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={nameVal} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={numberVal} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const ContactList = ({ contacts, onDelete }) => (
  <div>
    {contacts.map((contact) => (
      <PersonEntry key={contact.id} person={contact} onDelete={onDelete} />
    ))}
  </div>
);

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [inputName, setInputName] = useState("");
  const [inputNumber, setInputNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    personService.getAll().then((data) => setContacts(data));
  }, []);

  const showMessage = (text, type = "success") => {
    setStatusMessage(text);
    setMessageType(type);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const existing = contacts.find(
      (contact) => contact.name.toLowerCase() === inputName.toLowerCase(),
    );

    if (existing) {
      if (
        !window.confirm(
          `${existing.name} is already added to phonebook, replace the old number with a new one?`,
        )
      )
        return;

      const updated = { ...existing, number: inputNumber };
      personService
        .update(existing.id, updated)
        .then((saved) => {
          setContacts(contacts.map((c) => (c.id === existing.id ? saved : c)));
          showMessage(`Updated ${saved.name}`, "success");
          setInputName("");
          setInputNumber("");
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            showMessage(
              error.response.data.error || "Failed to update contact",
              "error",
            );
          } else {
            showMessage(
              `Information of ${existing.name} has already been removed from server`,
              "error",
            );
            setContacts(contacts.filter((c) => c.id !== existing.id));
          }
          setInputName("");
          setInputNumber("");
        });
      return;
    }

    const newContact = { name: inputName, number: inputNumber };
    personService
      .create(newContact)
      .then((saved) => {
        setContacts(contacts.concat(saved));
        showMessage(`Added ${saved.name}`, "success");
        setInputName("");
        setInputNumber("");
      })
      .catch((error) => {
        showMessage(
          error.response?.data?.error || "Failed to add contact",
          "error",
        );
      });
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete ${name} ?`)) return;

    personService
      .remove(id)
      .then(() => {
        setContacts(contacts.filter((contact) => contact.id !== id));
      })
      .catch(() => {
        showMessage(`${name} has already been removed from server`, "error");
        setContacts(contacts.filter((contact) => contact.id !== id));
      });
  };

  const visibleContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={statusMessage} type={messageType} />
      <SearchFilter
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <h3>Add a new</h3>
      <ContactForm
        onSubmit={handleSubmit}
        nameVal={inputName}
        onNameChange={(e) => setInputName(e.target.value)}
        numberVal={inputNumber}
        onNumberChange={(e) => setInputNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <ContactList contacts={visibleContacts} onDelete={handleDelete} />
    </div>
  );
};

export default App;
