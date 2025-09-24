import React, { useState } from 'react';
import UserInfo from './UserInfo';
import { User } from './types';
import DeleteUserModal from './DeleteUserModal';

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
      <DeleteUserModal
        userName={user.name}
        onDelete={() => { onDelete(); setShowDeleteConfirm(false); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    )}
    </div>
  );
};

export default UserDetails;
