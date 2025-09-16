import { PostDisplay, PostHeading } from '../../components/Timeline';

import FollowButton from './FollowButton';

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
			<PostHeading
				userName={userName}
				displayName={displayName}
				profilePicture={profilePicture}
			/>
			<FollowButton user={user} />
		  {posts.map((post) => <PostDisplay key={post.id} {...post} />)}
		</>
	);
}
