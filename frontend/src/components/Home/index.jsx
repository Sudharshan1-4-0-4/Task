import './home.css';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialItems = [
  { id: 1, name: 'Item 1', category: 'Category A', date: '2024-06-01' },
  { id: 2, name: 'Item 2', category: 'Category B', date: '2024-06-02' },
  { id: 3, name: 'Item 3', category: 'Category A', date: '2024-06-03' },
];

const Home = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");

  // Load items from localStorage
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items'));
    if (storedItems) {
      setItems(storedItems);
    } else {
      setItems(initialItems);
    }
  }, []);

  // Save items to localStorage whenever items state changes
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const onChangeName = (event) => setName(event.target.value);
  const onChangeCategory = (event) => setCategory(event.target.value);
  const onChangeDate = (event) => setDate(event.target.value);
  const onSearchChange = (event) => setSearchTerm(event.target.value);
  const onSortChange = (event) => setSortCriteria(event.target.value);

  const onAddItem = (event) => {
    event.preventDefault();
    if (editId) {
      // Update item
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editId
            ? { ...item, name, category, date }
            : item
        )
      );
      setEditId(null);
    } else {
      // Add new item
      const newItem = {
        id: uuidv4(),
        name,
        category,
        date,
      };
      setItems((prevItems) => [...prevItems, newItem]);
    }

    setName("");
    setCategory("");
    setDate("");
  };

  const onEditItem = (id) => {
    const itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setDate(itemToEdit.date);
      setEditId(id);
    }
  };

  const onDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortCriteria === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortCriteria === "date") {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  return (
    <div className="container">
      <h1>Items</h1>
      <form onSubmit={onAddItem}>
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={onChangeName}
          required
        />
        <input
          type="text"
          placeholder="Item category"
          value={category}
          onChange={onChangeCategory}
          required
        />
        <input
          type="text"
          placeholder="Date"
          value={date}
          onChange={onChangeDate}
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <div className="search-sort">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={onSearchChange}
        />
        <select value={sortCriteria} onChange={onSortChange}>
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      <ul>
        {sortedItems.map((item) => (
          <li key={item.id}>
            {item.name} - {item.category} - {item.date}
            <div>
              <button onClick={() => onEditItem(item.id)}>Edit</button>
              <button onClick={() => onDeleteItem(item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
