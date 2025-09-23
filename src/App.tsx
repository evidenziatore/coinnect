import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import UserForm from './UserForm';
import UserList from './UserList';
import UserDetails from './UserDetails';
import UserEditForm from './UserEditForm';

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchUsers = async () => {
    const result: User[] = await invoke('list_users');
    setUsers(result);
    // if (result.length === 1) setSelectedUser(result[0]);
  };

  useEffect(() => { fetchUsers(); }, []);

  // Resetto i campi solo quando si apre la maschera di aggiunta
  useEffect(() => {
    if (showCreateForm) {
      setNameInput('');
      setEmailInput('');
    }
  }, [showCreateForm]);

  const addUser = async () => {
    if (!nameInput) return alert('Inserisci il nome');
    await invoke('add_user', { name: nameInput, email: emailInput || null });
    setNameInput(''); setEmailInput('');
    await fetchUsers();
    setShowCreateForm(false);
    setSelectedUser(null);
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
        />
      </div>
    );
  }

  if (!selectedUser && users.length > 0) {
    if (showCreateForm) {
      return (
        <div className="app-container">
          <h1>Crea nuovo utente</h1>
          <UserForm
            name={nameInput}
            email={emailInput}
            setName={setNameInput}
            setEmail={setEmailInput}
            onSubmit={async () => { await addUser(); setShowCreateForm(false); }}
            onBack={() => setShowCreateForm(false)}
          />
        </div>
      );
    }
    return (
      <div className="app-container">
        <h1>Seleziona un utente</h1>
        <UserList users={users} onSelect={setSelectedUser} />
        <button className="button add-user-btn" onClick={() => setShowCreateForm(true)}>
          Aggiungi nuovo utente
        </button>
      </div>
    );
  }



  // Non serve più prepopolare i campi qui: UserEditForm gestisce lo stato locale

  if (showEditForm && selectedUser) {
    return (
      <div className="app-container">
        <h1>Modifica utente</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18, width: '100%' }}>
          <div style={{ width: '100%', maxWidth: 320, marginBottom: 8, textAlign: 'center' }}><strong>Nome:</strong> {selectedUser.name}</div>
          <div style={{ width: '100%', maxWidth: 320, marginBottom: 8, textAlign: 'center' }}><strong>Email:</strong> {selectedUser.email || '-'}</div>
          <div style={{ width: '100%', maxWidth: 320, textAlign: 'center' }}><strong>Creato il:</strong> {selectedUser.created_at || '-'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <UserEditForm
            name={selectedUser.name || ''}
            email={selectedUser.email || ''}
            onSubmit={async (newName, newEmail) => {
              await invoke('edit_user', { id: selectedUser.id, name: newName, email: newEmail || null });
              await fetchUsers();
              const updated = users.find(u => u.id === selectedUser.id);
              if (updated) setSelectedUser(updated);
              setShowEditForm(false);
            }}
            onBack={() => setShowEditForm(false)}
          />
        </div>
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
          onEdit={() => setShowEditForm(true)}
          onDelete={removeUser}
          onSelectAnother={() => setSelectedUser(null)}
          onAddNew={addUser}
        />
      )}
    </div>
  );
};

export default App;
