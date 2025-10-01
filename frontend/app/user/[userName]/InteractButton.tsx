'use client'

import axios from 'axios';
import { useState } from 'react';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import EditIcon from '@mui/icons-material/Edit';

import Loading from '../../components/Loading';

import EditProfileForm from './EditProfileForm';

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

function Unfollow({ onClick }) {
	return (
		<button type="button" onClick={onClick}>
			<PersonRemoveIcon />
			Unfollow
		</button>
	);
}
function Follow({ onClick }) {
	return (
		<button type="button" onClick={onClick}>
			<PersonAddIcon />
			Follow
		</button>
	);
}
function Edit({ onClick }) {
	return (
		<button type="button" onClick={onClick}>
			<EditIcon />
			Edit Profile
		</button>
	);
}

export default function InteractButton({ user, reloadUser }) {
	const [pending, setPending] = useState(false);
	const [following, setFollowing] = useState(alreadyFollowing(user));
	const [editing, setEditing] = useState();

	const { userName } = user;

	function request(action) {
		setPending(true);

		axios.post(`/user/${userName}/${action}`)
			.then(() => {
				if (action === 'follow') setFollowing(true);
				if (action === 'unfollow') setFollowing(false);
				setPending(false);
			});
	}
	function follow() { request('follow'); }
	function unfollow() { request('unfollow'); }
	function openEditForm() { setEditing(true); }
	function closeEditForm() { setEditing(false); }
	function postEdit() {
		setEditing(false);
		reloadUser();
	}

	if (pending) return <button type="button" disabled><Loading /></button>;
	if (isSelf(user)) {
		return (
			<>
				<Edit onClick={openEditForm} />
				<EditProfileForm
					open={editing}
					close={closeEditForm}
					postEdit={postEdit}
					user={user}
				/>
			</>
		);
	}		
	if (following) return <Unfollow onClick={unfollow} />;
	return <Follow onClick={follow} />;
}
