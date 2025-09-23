import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import UserForm from './UserForm';
import UserList from './UserList';
import UserDetails from './UserDetails';

interface User {
  id: number;
  name: string;
  email?: string;
  created_at?: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const fetchUsers = async () => {
    const result: User[] = await invoke('list_users');
    setUsers(result);
    if (result.length === 1) setSelectedUser(result[0]);
  };

  useEffect(() => { fetchUsers(); }, []);

  const addUser = async () => {
    if (!nameInput) return alert('Inserisci il nome');
    await invoke('add_user', { name: nameInput, email: emailInput || null });
    setNameInput(''); setEmailInput('');
    await fetchUsers();
    const lastUser = users[users.length - 1];
    if (lastUser) setSelectedUser(lastUser);
  };

  const editUser = async () => {
    if (!selectedUser) return;
    await invoke('edit_user', { id: selectedUser.id, name: nameInput, email: emailInput || null });
    setNameInput(''); setEmailInput('');
    await fetchUsers();
    const updated = users.find(u => u.id === selectedUser.id);
    if (updated) setSelectedUser(updated);
  };

  const removeUser = async () => {
    if (!selectedUser) return;
    await invoke('remove_user', { id: selectedUser.id });
    await fetchUsers();
      setSelectedUser(null);
  };

  if (!selectedUser && users.length === 0) {
    return (
      <div className="app-container">
        <h1>Crea il tuo primo utente</h1>
        <UserForm
          name={nameInput}
          email={emailInput}
          setName={setNameInput}
          setEmail={setEmailInput}
          onSubmit={addUser}
          submitLabel="Crea Utente"
        />
      </div>
    );
  }

  if (!selectedUser && users.length > 0) {
    return (
      <div className="app-container">
        <h1>Seleziona un utente</h1>
        <UserList users={users} onSelect={setSelectedUser} />
        <h2>Aggiungi nuovo utente</h2>
        <UserForm
          name={nameInput}
          email={emailInput}
          setName={setNameInput}
          setEmail={setEmailInput}
          onSubmit={addUser}
          submitLabel="Crea Utente"
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {selectedUser && (
  <UserDetails
    user={selectedUser}
    nameInput={nameInput}
    emailInput={emailInput}
    setNameInput={setNameInput}
    setEmailInput={setEmailInput}
    onEdit={editUser}
    onDelete={removeUser}
    onSelectAnother={() => setSelectedUser(null)}
    onAddNew={addUser}
  />
)}
    </div>
  );
};

export default App;
