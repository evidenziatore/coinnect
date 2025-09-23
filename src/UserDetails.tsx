import React, { useState } from 'react';
import UserInfo from './UserInfo';
import { User } from './types';

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
  user, 
  onEdit, onDelete, onSelectAnother}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      width: '95vw',
      height: '95vh',
      transform: 'translate(-50%, -50%)',
      background: '#fafbfc',
      borderRadius: '24px',
      boxShadow: '0 4px 32px rgba(0,0,0,0.10)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          className="button"
          style={{ fontWeight: 'bold', fontSize: '1.2rem', padding: '8px 18px 8px 18px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setDropdownOpen(v => !v)}
          aria-label="Azioni utente"
        >
          {user.name}
          <span role="img" aria-label="Impostazioni" style={{ fontSize: '2.8rem', lineHeight: '1' }}>⚙️</span>
        </button>
        {dropdownOpen && (
          <div className="user-actions-dropdown">
            <button className="dropdown-btn" onClick={() => { setDropdownOpen(false); onSelectAnother(); }}>Seleziona altro utente</button>
            <button className="dropdown-btn" onClick={() => { setDropdownOpen(false); onEdit(); }}>Modifica utente</button>
            <button className="dropdown-btn delete" onClick={() => { setDropdownOpen(false); setShowDeleteConfirm(true); }}>Elimina utente</button>
          </div>
        )}
      </div>
      <UserInfo user={user} />
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', minWidth: 320, textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 18 }}>
              <div>
                Sei sicuro di voler eliminare l'utente <b>{user.name}</b>?
              </div>
              <div>
                Questa operazione è irreversibile e tutti i dati collegati all'utente verranno persi.
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: 12 }}>
              <button className="button-red" onClick={() => { setShowDeleteConfirm(false); onDelete(); }}>Elimina</button>
              <button className="button" onClick={() => setShowDeleteConfirm(false)}>Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
