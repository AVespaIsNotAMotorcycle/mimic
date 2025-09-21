'use client';

import { useState } from 'react';

import axios from 'axios';

import Input from '../../components/Input';
import Loading from '../../components/Loading';
import Popup from '../../components/Popup';
import { getCredentials } from '../../utils';

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
  user = {},
}) {
  const credentials = getCredentials();

  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    bio: user.bio || '',
  });
  function updateForm(key, target) {
    const value = FORM[key].type === 'image'
      ?	target.files[0]
      : target.value;
    setFormData({ ...formData, [key]: value });
  }

  async function apply(event) {
    event.preventDefault();

    const { userName } = credentials;
    const multipartData = createMultipartData(formData);
    axios.put(`/user/${userName}`, multipartData).then(postEdit);
  }

  if (!credentials) return <Loading />;
  return (
    <Popup open={open}>
      <form
        className="edit-profile"
        onSubmit={apply}
        type="multipart/form-data"
      >
        {Object.entries(FORM).map(([key, { label, type, requirements }]) => (
          <Input
            key={key}
            avinam3
            inputID={key}
            label={label}
            requirements={requirements}
            type={type}
            value={formData[key]}
            onChange={({ target }) => {
              updateForm(key, target);
            }}
          />
        ))}
        <div className="button-group">
          <button onClick={close} type="button">Cancel</button>
          <button type="submit">Apply changes</button>
        </div>
      </form>
    </Popup>
  );
}
