'use client'

import axios from 'axios';
import { useState } from 'react';

import { getCredentials } from '../../utils';

import Popup from '../../components/Popup';
import Input from '../../components/Input';
import Loading from '../../components/Loading';

const FORM = {
	profilePicture: {
		label: 'Profile picture',
		type: 'image',
	},
	backgroundPicture: {
		label: 'Background picture',
		type: 'image',
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

export default function EditProfile({
	open,
	close = () => {},
	postEdit = () => {},
}) {
	const credentials = getCredentials();

	const [formData, setFormData] = useState({});
	function updateForm(key, target) {
		const value = FORM[key].type === 'image'
			?	target.files[0]
			: target.value;
		setFormData({ ...formData, [key]: value });
	}

	async function apply (event) {
		event.preventDefault();

		const { userName } = credentials;
		const multipartData = createMultipartData(formData);
		axios.put(`/user/${userName}`, multipartData).then(postEdit);
	}

	if (!credentials) return <Loading />;
	return (
		<Popup open={open}>
			<form type="multipart/form-data" onSubmit={apply}>
				{Object.entries(FORM).map(([key, { label, type, requirements }]) => (
					<Input
						key={key}
						inputID={key}
						label={label}
						type={type}
						value={formData[key]}avinam3
						onChange={({ target }) => { updateForm(key, target); }}
						requirements={requirements}
					/>
				))}
				<div className="button-group">
					<button type="button" onClick={close}>Cancel</button>
					<button type="submit">Apply changes</button>
				</div>
			</form>
		</Popup>
	);
}
