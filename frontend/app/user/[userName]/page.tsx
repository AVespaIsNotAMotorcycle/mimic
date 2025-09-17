import { PostDisplay } from '../../components/Timeline';

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
			<img
				src={`${imagesURL}/${backgroundPicture}`}
				className="background-picture"
			/>
			<div className="profile-heading">
				<div className="profile-picture-container">
					<img
						src={`${imagesURL}/${profilePicture}`}
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

export default async function Profile({
	params,
}: {
	params: Promise<{ userName: string }>,
}) {
	const { userName } = await params;
	
  const data = await fetch(`http://localhost:8000/user/${userName}`);
	const user = await data.json();
  const {
		displayName,
		profilePicture,
		posts,
	} = user;

	return (
		<>
			<Heading user={user} />
		  {posts.map((post) => <PostDisplay key={post.id} {...post} />)}
		</>
	);
}
