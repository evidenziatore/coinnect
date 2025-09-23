import React from 'react';

interface UserFormProps {
  name: string;
  email: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  onSubmit: () => void;
  onBack?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ name, email, setName, setEmail, onSubmit, onBack }) => (
  <div>
    <input className="input-field" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
    <input className="input-field" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
        <button className="button-green" onClick={onSubmit}>Crea nuovo utente</button>
      {onBack && (
        <button className="button" type="button" onClick={onBack}>
          Indietro
        </button>
      )}
    </div>
  </div>
);

export default UserForm;
