'use client'

import axios from 'axios';
import { useState } from 'react';

import Input from './Input';
import { createMultipartData, getCredentials } from '../utils';

import './ComposePost.css';

function fileListToArray(fileList) {
  const array = [];
  for (let index = 0; index < fileList.length; index += 1) {
    array.push(fileList.item(index));
  }
  return array;
}

const IMAGES_REQUIREMENTS = [
  [
    'Cannot upload more than four images.',
    (value) => value.length <= 4,
  ]
];

export default function ComposePost({
  prompt = 'Compose post:',
	replyTo,
	quoteOf,
	onSuccess = () => {},
}) {
	const credentials = getCredentials();
  const authKey = credentials && credentials.authKey;

	const [pending, setPending] = useState(false);
	const [text, setText] = useState('');
  const [images, setImages] = useState([]);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending(true);

		const body = { text };
		if (replyTo) body.replyTo = replyTo;
		if (quoteOf) body.quoteOf = quoteOf;
    if (images.length) body.images = fileListToArray(images);

    const multipartData = createMultipartData(body);
		axios.post('/posts', multipartData)
      .then(({ data }) => {
  			setPending(false);
  			setText('');
        setImages([]);
  			onSuccess(data);
  		});
	}
	if (!authKey) return null;
  return (
		<form className="compose-post" onSubmit={onSubmit} disabled={pending}>
			<Input
				label={prompt}
				id="compose-post-field"
				type="textarea"
				value={text}
				onChange={({ target }) => { setText(target.value); }}
			/>
      <Input
        label="Attach images"
        id="attach-image-field"
        type="image"
				onChange={({ target }) => { setImages(target.files); }}
        multiple
        requirements={IMAGES_REQUIREMENTS}
        value={images}
      />
			<button type="submit">Post</button>
		</form>
	);
}
