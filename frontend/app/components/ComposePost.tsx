'use client'

import { useState } from 'react';

import Input from './Input';

export default function ComposePost() {
	const [text, setText] = useState('');

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const authKey = localStorage.getItem('authKey');

		const response = await fetch('http://localhost:8000/posts', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Authorization": authKey,
			},
			body: JSON.stringify({ text }),
		});
	}
  return (
		<form className="composepost" onSubmit={onSubmit}>
			<Input
				label="Compose post:"
				id="compose-post-field"
				type="textarea"
				value={text}
				onChange={({ target }) => { setText(target.value); }}
			/>
			<button type="submit">Post</button>
		</form>
	);
}
