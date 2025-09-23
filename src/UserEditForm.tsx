
import React, { useState, useEffect } from 'react';

interface UserEditFormProps {
  name: string;
  email: string;
  onSubmit: (name: string, email: string) => void;
  onBack?: () => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ name, email, onSubmit, onBack }) => {
  const [localName, setLocalName] = useState(name);
  const [localEmail, setLocalEmail] = useState(email);

  useEffect(() => {
    setLocalName(name);
    setLocalEmail(email);
  }, [name, email]);

  const handleSubmit = () => {
    onSubmit(localName, localEmail);
  };

  return (
    <div>
      <input className="input-field" placeholder="Nome" value={localName} onChange={e => setLocalName(e.target.value)} />
      <input className="input-field" placeholder="Email" value={localEmail} onChange={e => setLocalEmail(e.target.value)} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
        <button className="button-green" onClick={handleSubmit}>Salva Modifiche</button>
        {onBack && (
          <button className="button" type="button" onClick={onBack}>
            Indietro
          </button>
        )}
      </div>
    </div>
  );
};

export default UserEditForm;
