'use client'

import { useState } from 'react';

import Input from '../components/Input';

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
	};

  return (
		<form onSubmit={onSubmit}>
			<Input
				id="userName"
				label="Username"
				value={userName}
				onChange={({ target }) => { setUserName(target.value); }}
			/>
			<Input
				id="password"
				type="password"
				label="Password"
				value={password}
				onChange={({ target }) => { setPassword(target.value); }}
			/>
			<button type="submit">Login</button>
		</form>
	);
}
