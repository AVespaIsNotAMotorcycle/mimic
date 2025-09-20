'use client'

import axios from 'axios';
import { useState } from 'react';

import { getCredentials } from '../utils';

import Input from '../components/Input';
import Loading from '../components/Loading';

const FORM = {
	profilePicture: {
		label: 'Profile picture',
		type: 'image',
	},
	backgroundPicture: {
		label: 'Background picture',
		type: 'image',
	},
	userName: {
		label: 'userName',
	},
	displayName: {
		label: 'Display name',
	},
	bio: {
		label: 'Bio',
		type: 'textarea',
	},
};

function createMultipartData(formData) {
	const multipartData = new FormData();
	Object.entries(formData)
		.forEach(([key, value]) => {
			multipartData.append(key, value);
		});
	return multipartData;
}
async function makeCall(credentials, multipartData) {
	const { userName, authKey } = credentials;
	axios.put(`/user/${userName}`, multipartData);
}

export default function EditProfile() {
	const credentials = getCredentials();

	const [formData, setFormData] = useState({});
	function updateForm(key, target) {
		const value = FORM[key].type === 'image'
			?	target.files[0]
			: target.value;
		setFormData({ ...formData, [key]: value });
	}

	function cancel (event) { event.preventDefault(); }
	async function apply (event) {
		event.preventDefault();

		const multipartData = createMultipartData(formData);
		const response = await makeCall(credentials, multipartData);
	}

	if (!credentials) return <Loading />;
	return (
		<form type="multipart/form-data" onSubmit={apply}>
			{Object.entries(FORM).map(([key, { label, type, requirements }]) => (
				<Input
					key={key}
					inputID={key}
					label={label}
					type={type}
					value={formData[key]}
					onChange={({ target }) => { updateForm(key, target); }}
					requirements={requirements}
				/>
			))}
			<div className="button-group">
				<button type="button" onClick={cancel}>Cancel</button>
				<button type="submit">Apply changes</button>
			</div>
		</form>
	);
}
