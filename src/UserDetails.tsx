import React from 'react';
import UserForm from './UserForm';

interface User {
  id: number;
  name: string;
  email?: string;
  created_at?: string;
}

interface UserDetailsProps {
  user: User;
  nameInput: string;
  emailInput: string;
  setNameInput: (v: string) => void;
  setEmailInput: (v: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onSelectAnother: () => void;
  onAddNew: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user, nameInput, emailInput, setNameInput, setEmailInput,
  onEdit, onDelete, onSelectAnother, onAddNew
}) => (
  <div>
    <h1>Dettagli Utente</h1>
    <p><strong>Nome:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email || '-'}</p>
    <p><strong>Creato il:</strong> {user.created_at || '-'}</p>

    <h2>Modifica Utente</h2>
    <UserForm
      name={nameInput}
      email={emailInput}
      setName={setNameInput}
      setEmail={setEmailInput}
      onSubmit={onEdit}
      submitLabel="Salva Modifiche"
    />

    <h2>Gestione Utente</h2>
    <button className="button" onClick={onDelete}>Elimina Utente</button>
    <button className="button" onClick={onSelectAnother}>Seleziona un altro utente</button>

    <h2>Aggiungi Nuovo Utente</h2>
    <UserForm
      name={nameInput}
      email={emailInput}
      setName={setNameInput}
      setEmail={setEmailInput}
      onSubmit={onAddNew}
      submitLabel="Crea Utente"
    />
  </div>
);

export default UserDetails;
