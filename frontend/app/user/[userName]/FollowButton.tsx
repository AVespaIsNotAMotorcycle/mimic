'use client'

function alreadyFollowing(user) {
  if (!user) return false;
	if (!user.following) return false;
	if (!Array.isArray(user.following)) return following;
	const prospectiveFollower = localStorage.getItem('userName');
	const actualFollower = user.following
		.find((followerName) => followerName === prospectiveFollower);
	return !!actualFollower;
}

function isSelf(user) {
	const viewedUser = user.userName;
	const viewingUser = localStorage.getItem('userName');
	return viewedUser === viewingUser;
}

export default function FollowButton({ user }) {
	const { following } = user;
	if (isSelf(user)) return null;
	if (alreadyFollowing(user)) {
		return <button type="button">Unfollow</button>;
	} else {
		return <button type="button">Follow</button>;
	}
}
