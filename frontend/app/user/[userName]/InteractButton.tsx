'use client';

import { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from 'axios';

import EditProfileForm from './EditProfileForm';
import Loading from '../../components/Loading';

function alreadyFollowing(user) {
  if (!user) return false;
  if (!user.followers) return false;
  if (!Array.isArray(user.followers)) return false;
  const prospectiveFollower = localStorage.getItem('userName');
  const actualFollower = user.followers
    .find((followerName) => followerName === prospectiveFollower);
  return !!actualFollower;
}

function isSelf(user) {
  const viewedUser = user.userName;
  const viewingUser = localStorage.getItem('userName');
  return viewedUser === viewingUser;
}

const Unfollow = ({ onClick }) => (
  <button onClick={onClick} type="button">
    <PersonRemoveIcon />
    Unfollow
  </button>
);
const Follow = ({ onClick }) => (
  <button onClick={onClick} type="button">
    <PersonAddIcon />
    Unfollow
  </button>
);
const Edit = ({ onClick }) => (
  <button onClick={onClick} type="button">
    <EditIcon />
    Edit Profile
  </button>
);

export default function InteractButton({ user, reloadUser }) {
  const [pending, setPending] = useState(false);
  const [following, setFollowing] = useState(alreadyFollowing(user));
  const [editing, setEditing] = useState();

  const { userName } = user;
  const authKey = localStorage.getItem('authKey');

  function request(action) {
    setPending(true);

    axios.post(`/user/${userName}/${action}`)
      .then(() => {
        if (action === 'follow') setFollowing(true);
        if (action === 'unfollow') setFollowing(false);
        setPending(false);
      });
  }
  function follow() {
    request('follow');
  }
  function unfollow() {
    request('unfollow');
  }
  function openEditForm() {
    setEditing(true);
  }
  function closeEditForm() {
    setEditing(false);
  }
  function postEdit() {
    setEditing(false);
    reloadUser();
  }

  if (pending) return <button disabled type="button"><Loading /></button>;
  if (isSelf(user)) {
    return (
      <React.Fragment>
        <Edit onClick={openEditForm} />
        <EditProfileForm
          close={closeEditForm}
          open={editing}
          postEdit={postEdit}
          user={user}
        />
      </React.Fragment>
    );
  }
  if (following) return <Unfollow onClick={unfollow} />;
  return <Follow onClick={follow} />;
}
