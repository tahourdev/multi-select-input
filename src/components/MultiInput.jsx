import React, { useEffect, useRef, useState } from 'react';
import Pill from './pill';

const MultiInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    fetchUser();
  }, [searchTerm]);

  const fetchUser = () => {
    if (searchTerm.trim() === ' ' || searchTerm === '') {
      setSuggestions([]);
      return;
    }
    fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectUser = (user) => {
    setSelectedUser([...selectedUser, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm('');
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemove = (user) => {
    const updatedUsers = selectedUser.filter((selectedUser) => selectedUser.id !== user.id);
    const updatedEmail = new Set(selectedUserSet);
    updatedEmail.delete(user.email);
    setSelectedUser(updatedUsers);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && e.target.value === '' && selectedUser.length > 0) {
      const lastUser = selectedUser[selectedUser.length - 1];
      handleRemove(lastUser);
      setSuggestions([]);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {selectedUser?.map((user) => {
          return (
            <Pill
              key={user.email}
              onClick={() => handleRemove(user)}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
            />
          );
        })}

        <div>
          <input
            ref={inputRef}
            value={searchTerm}
            onKeyDown={handleKeyDown}
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for user"
          />
          {/* Search Suggestion */}
          <ul className="suggestions-list">
            {suggestions?.users?.map((user, index) => {
              return !selectedUserSet.has(user.email) ? (
                <li
                  key={user.email}
                  onClick={() => handleSelectUser(user)}
                  className={index === activeSuggestionIndex ? 'active' : ''}>
                  <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MultiInput;
