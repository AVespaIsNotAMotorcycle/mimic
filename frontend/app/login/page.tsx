'use client'

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

import Input from '../components/Input';
import Box from '../components/Box';

export function logInAndRedirect(userName: string, authKey: string) {
	localStorage.setItem("userName", userName);
	localStorage.setItem("authKey", authKey);
	window.location.assign('..');
}

export default function Login() {
	axios.defaults.baseURL = 'http://localhost:8000';
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		axios.post('/login', { userName, password })
			.then(({ data }) => { logInAndRedirect(userName, data); });
	};

  return (
		<Box className="login">
  		<form onSubmit={onSubmit}>
  			<Input
  				id="userName"
  				label="Username"
  				value={userName}
  				onChange={({ target }) => { setUserName(target.value); }}
  				required
  			/>
  			<Input
  				id="password"
  				type="password"
  				label="Password"
  				value={password}
  				onChange={({ target }) => { setPassword(target.value); }}
  				required
  			/>
  			<button type="submit">Login</button>
  		</form>
			<a className="center" href="/sign_up">No account? Sign up here</a>
		</Box>
	);
}
