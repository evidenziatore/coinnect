import React from 'react';
import { User } from './types';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div style={{
      padding: '16px',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      margin: '16px'
    }}>
      <div style={{ marginBottom: '8px', fontSize: '1rem' }}>
        <strong>Nome:</strong> {user.name}
      </div>
      <div style={{ fontSize: '1rem' }}>
        <strong>Email:</strong> {user.email || '-'}
      </div>
    </div>
  );
};

export default UserInfo;