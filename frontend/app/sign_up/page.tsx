'use client'

import { useState } from 'react';

import Input from '../components/Input';

const FORM = {
  email1: {
		type: 'email',
		label: 'Email address',
	},
	email2: {
		type: 'email',
		label: 'Confirm email address',
	},
	username: {
		label: 'Username',
	},
	displayname: {
		label: 'Display name',
	},
	password1: {
		type: 'password',
		label: 'Password',
		requirements: [
			[
				'Password must be at least 6 characters',
				(value) => value.length >= 6,
			],
			[
				'Password must contain a capital letter',
				(value) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find((letter) => value.includes(letter)),
			],
			[
				'Password must contain a number',
				(value) => '0123456789'.split('').find((letter) => value.includes(letter)),
			],
		],
	},
	password2: {
		type: 'password',
		label: 'Confirm password',
	},
};

const FORM_ID = 'signup_form';

export default function SignUp() {
	const [formData, setFormData] = useState({});

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		console.log(formData);
	}

	const updateForm = (key, value) => {
		console.log(key, value);
		setFormData({ ...formData, [key]: value });
	};

	if (formData.password1) {
		FORM.password2.requirements = [[
			'Passwords must match',
			(value) => value === formData.password1,
		]];
	} else {
		FORM.password2.requirements = undefined;
	}
	if (formData.email1) {
		FORM.email2.requirements = [[
			'Emails must match',
			(value) => value === formData.email1,
		]];
	} else {
		FORM.email2.requirements = undefined;
	}

  return (
		<form onSubmit={onSubmit} id={FORM_ID}>
			{Object.entries(FORM).map(([key, { label, type, requirements }]) => (
				<Input
					key={key}
					inputID={key}
					label={label}
					type={type}
					value={formData[key]}
					onChange={({ target }) => { updateForm(key, target.value); }}
					requirements={requirements}
				/>
			))}
			<button type="submit">Submit</button>
		</form>
	);
}
