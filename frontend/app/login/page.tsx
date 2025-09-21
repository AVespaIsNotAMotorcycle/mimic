'use client';

import { useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/router';

import Box from '../components/Box';
import Input from '../components/Input';

export function logInAndRedirect(userName: string, authKey: string) {
  localStorage.setItem('userName', userName);
  localStorage.setItem('authKey', authKey);
  window.location.assign('..');
}

export default function Login() {
  axios.defaults.baseURL = 'http://localhost:8000';
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    axios.post('/login', { userName, password })
      .then(({ data }) => {
        logInAndRedirect(userName, data);
      });
  }

  return (
    <Box>
      <form onSubmit={onSubmit}>
        <Input
          required
          id="userName"
          label="Username"
          value={userName}
          onChange={({ target }) => {
            setUserName(target.value);
          }}
        />
        <Input
          required
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={({ target }) => {
            setPassword(target.value);
          }}
        />
        <button type="submit">Login</button>
      </form>
      <a href="/sign_up">No account? Sign up here</a>
    </Box>
  );
}
