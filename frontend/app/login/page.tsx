'use client'

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
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const response = await fetch('http://localhost:8000/login', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userName, password }),
		});

		if (!response.ok) return;
		const authKey = await response.text();
		logInAndRedirect(userName, authKey);
	};

  return (
		<Box>
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
			<a href="/sign_up">No account? Sign up here</a>
		</Box>
	);
}
