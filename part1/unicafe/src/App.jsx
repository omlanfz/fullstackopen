import { useState } from "react";

const Button = ({ handleClick, label }) => (
  <button onClick={handleClick}>{label}</button>
);

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ positive, neutral, negative }) => {
  const total = positive + neutral + negative;

  if (total === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={positive} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={negative} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={(positive - negative) / total} />
        <StatisticLine
          text="positive"
          value={(positive * 100) / total + " %"}
        />
      </tbody>
    </table>
  );
};

const App = () => {
  const [positive, setPositive] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [negative, setNegative] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setPositive(positive + 1)} label="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} label="neutral" />
      <Button handleClick={() => setNegative(negative + 1)} label="bad" />
      <h1>statistics</h1>
      <Statistics positive={positive} neutral={neutral} negative={negative} />
    </div>
  );
};

export default App;
