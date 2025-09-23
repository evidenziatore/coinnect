import React from 'react';
import { User } from './types';

interface UserListProps {
  users: User[];
  onSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onSelect }) => (
  <ul className="user-list">
    {users.map(user => (
      <li key={user.id} onClick={() => onSelect(user)}>
        {user.name} {user.email && `(${user.email})`}
      </li>
    ))}
  </ul>
);

export default UserList;
