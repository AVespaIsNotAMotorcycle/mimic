'use client'

import { useState } from 'react';

import Input from './Input';

function getAuthKey() {
	if (typeof localStorage === 'undefined') return undefined;
	const authKey = localStorage.getItem('authKey');
	return authKey;
}

export default function ComposePost({
  prompt = 'Compose post:',
	replyTo,
}) {
	const authKey = getAuthKey();

	const [pending, setPending] = useState(false);
	const [text, setText] = useState('');

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending(true);

		const body = { text };
		if (replyTo) body.replyTo = replyTo;
		const response = await fetch('http://localhost:8000/posts', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Authorization": authKey,
			},
			body: JSON.stringify(body),
		});

		setPending(false);
		if (response.ok) setText('');
	}
	if (!authKey) return null;
  return (
		<form className="composepost" onSubmit={onSubmit} disabled={pending}>
			<Input
				label={prompt}
				id="compose-post-field"
				type="textarea"
				value={text}
				onChange={({ target }) => { setText(target.value); }}
			/>
			<button type="submit">Post</button>
		</form>
	);
}
