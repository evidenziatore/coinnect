import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import './App.css';

function App() {
  type User = {
  id: number;
  name: string;
};
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const result = await invoke<User[]>('list_users');
      setUsers(result);
    } catch (error) {
      console.error('Errore fetchUsers:', error);
    }
  };

  const addUser = async () => {
    try {
      await invoke('add_user', { name: 'Alice' });
      fetchUsers();
    } catch (error) {
      console.error('Errore addUser:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="app-container">
      <h1>Utenti</h1>
      <button className="button" onClick={addUser}>Aggiungi Alice</button>
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
