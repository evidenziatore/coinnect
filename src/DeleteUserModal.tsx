import React, { useState } from 'react';

interface DeleteUserModalProps {
  userName: string;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ userName, onDelete, onCancel }) => {
  const [confirmName, setConfirmName] = useState('');
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);

  const canDelete = confirmName === userName && confirmCheckbox;

  return (
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
          <div style={{ fontSize: '1.2rem', marginBottom: 18 }}>
            <div>
              Sei sicuro di voler eliminare l'utente <b>{userName}</b>?
            </div>
            <div>
              Questa operazione è irreversibile e tutti i dati collegati all'utente verranno persi.
            </div>
          </div>

          <div style={{ margin: '12px 0' }}>
            <input
              type="text"
              placeholder={`Scrivi "${userName}" per confermare`}
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ margin: '12px 0' }}>
            <label>
              <input
                type="checkbox"
                checked={confirmCheckbox}
                onChange={(e) => setConfirmCheckbox(e.target.checked)}
              /> Confermo di voler eliminare l'utente
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: 12 }}>
            <button
              className="button-red"
              onClick={onDelete}
              disabled={!canDelete}
            >
              Elimina
            </button>
            <button className="button" onClick={onCancel}>Annulla</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
