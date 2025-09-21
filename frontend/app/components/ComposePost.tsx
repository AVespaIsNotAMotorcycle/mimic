'use client';

import { useState } from 'react';

import axios from 'axios';

import Input from './Input';
import './ComposePost.css';

function getAuthKey() {
  if (typeof localStorage === 'undefined') return undefined;
  const authKey = localStorage.getItem('authKey');
  return authKey;
}

export default function ComposePost({
  prompt = 'Compose post:',
  replyTo,
  quoteOf,
  onSuccess = () => {},
}) {
  const authKey = getAuthKey();

  const [pending, setPending] = useState(false);
  const [text, setText] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const body = { text };
    if (replyTo) body.replyTo = replyTo;
    if (quoteOf) body.quoteOf = quoteOf;
    axios.post(
      '/posts',
      body,
      { headers: { 'Content-Type': 'application/json' } },
    ).then(({ data }) => {
      setPending(false);
      setText('');
      onSuccess(data);
    });
  }
  if (!authKey) return null;
  return (
    <form className="compose-post" disabled={pending} onSubmit={onSubmit}>
      <Input
        id="compose-post-field"
        label={prompt}
        type="textarea"
        value={text}
        onChange={({ target }) => {
          setText(target.value);
        }}
      />
      <button type="submit">Post</button>
    </form>
  );
}
