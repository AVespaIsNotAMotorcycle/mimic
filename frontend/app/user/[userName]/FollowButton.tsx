'use client'

import axios from 'axios';
import { useState } from 'react';

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

export default function FollowButton({ user }) {
	const [pending, setPending] = useState(false);
	const [following, setFollowing] = useState(alreadyFollowing(user));

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
	function follow() { request('follow'); }
	function unfollow() { request('unfollow'); }

	if (isSelf(user)) return null;
	if (pending) return <button type="button" disabled><Loading /></button>;
	if (following) {
		return <button type="button" onClick={unfollow}>Unfollow</button>;
	} else {
		return <button type="button" onClick={follow}>Follow</button>;
	}
}
