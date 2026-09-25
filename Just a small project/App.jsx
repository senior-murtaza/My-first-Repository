import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setInput(e.target.value);
    setMessage("");
  }

  function itemChange() {
    if (!input.trim()) {
      setMessage("There is nothing entered.");
      return;
    }

        if (items.includes(input.trim())) {
        setMessage("This item was already added.");
        return;
        }

    setItems([...items, input.trim()]);
    setInput("");
    setMessage("");
  }

  return (
    <div className="container">
      <h1>🛒 Shopping Basket</h1>

      <div className="input-section">
        <input
          type="text"
          value={input}
          placeholder="Enter an item..."
          onChange={handleChange}
        />

        <button onClick={itemChange}>Add</button>
      </div>

      <p>{message}</p>

      <div className="list-section">
        <h2>Shopping List</h2>

        <ol>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
