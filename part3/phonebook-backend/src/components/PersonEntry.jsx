const PersonEntry = ({ person, onDelete }) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => onDelete(person.id, person.name)}>delete</button>
  </div>
);

export default PersonEntry;
