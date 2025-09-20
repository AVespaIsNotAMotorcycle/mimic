'use client'

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Loading from '../../components/Loading';
import Post from '../../components/Post';
import Image from '../../components/Image';

import FollowButton from './FollowButton';
import './page.css';

function Heading({ user }) {
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
					<FollowButton user={user} />
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

	useEffect(() => {
		axios.get(`/user/${userName}`).then(({ data }) => { setUser(data); });
	}, []);

	if (!user) return <Loading />;
	return (
		<>
			<Heading user={user} />
		  {user.posts.map((post) => <Post key={post._id} {...post} />)}
		</>
	);
}
