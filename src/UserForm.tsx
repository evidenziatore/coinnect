import React from 'react';

interface UserFormProps {
  name: string;
  email: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
}

const UserForm: React.FC<UserFormProps> = ({ name, email, setName, setEmail, onSubmit, submitLabel }) => (
  <div>
    <input className="input-field" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
    <input className="input-field" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
    <button className="button" onClick={onSubmit}>{submitLabel}</button>
  </div>
);

export default UserForm;
