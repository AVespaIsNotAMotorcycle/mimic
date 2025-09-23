'use client'

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Loading from '../../components/Loading';
import Post from '../../components/Post';
import Image from '../../components/Image';

import InteractButton from './InteractButton';
import './page.css';

function Heading({ user, reloadUser = () => {} }) {
	const {
		displayName,
		userName,
		backgroundPicture,
		profilePicture,
		bio,
		followers = [],
	} = user;
	const imagesURL = 'http://localhost:8000/images/';
	return (
		<div className="profile">
			<Image
				source={backgroundPicture}
				className="background-picture"
			/>
			<div className="profile-heading">
				<div className="profile-picture-container">
					<Image
						source={profilePicture}
						className="profile-picture"
					/>
				</div>
				<div className="names">
					<h1>{displayName}</h1>
					<div>{`@${userName}`}</div>
					<div>{`${followers.length} followers`}</div>
				</div>
				<div className="follow-button-container">
					<InteractButton user={user} reloadUser={reloadUser} />
				</div>
			</div>
			<div className="profile-bio">
				{bio}
			</div>
		</div>
	);
}

export default function Profile() {
	const { userName } = useParams();
	const [user, setUser] = useState();

	function loadUser() {
		axios.get(`/user/${userName}`).then(({ data }) => { setUser(data); });
	}
	function reloadUser() { setUser(null); loadUser(); }
	useEffect(() => { loadUser(); }, []);

	if (!user) return <div className="vertical-center center"><Loading /></div>;
	return (
		<>
			<Heading user={user} reloadUser={reloadUser} />
		  {user.posts.map((post) => <Post key={post._id} {...post} />)}
		</>
	);
}
