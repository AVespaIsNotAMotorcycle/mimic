import { PostDisplay } from '../../components/Timeline';

import FollowButton from './FollowButton';
import './page.css';

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent egestas pulvinar aliquam. Fusce venenatis magna id dui varius hendrerit. Fusce ultricies euismod congue. Aliquam gravida lectus at purus luctus pretium. Ut at tellus eget odio faucibus efficitur nec sit amet lectus. Phasellus eu arcu at enim laoreet laoreet. Vivamus eget commodo diam, eget scelerisque justo. Proin vel mauris ac sem imperdiet lacinia. ';

function Heading({ user }) {
	const {
		displayName,
		userName,
		backgroundPicture = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F72%2Fba%2F57%2F72ba57cda8bfec7bb52624ca71b56b4a.jpg&f=1&nofb=1&ipt=60f079c93deb2a0e9ea654cb5d3da66250bfeec40e8a9f7f55c5dbd135ef46cb',
		profilePicture,
		bio = LOREM,
		followers = [],
	} = user;
	return (
		<div className="profile">
			<img src={backgroundPicture} className="background-picture" />
			<div className="profile-heading">
				<div className="profile-picture-container">
					<img src={profilePicture} className="profile-picture" />
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
