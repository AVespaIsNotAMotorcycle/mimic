import { PostDisplay, PostHeading } from '../../components/Timeline';

export default async function Profile({
	params,
}: {
	params: Promise<{ userName: string }>,
}) {
	const { userName } = await params;
	
  const data = await fetch(`http://localhost:8000/user/${userName}`);
  const {
		displayName,
		profilePicture,
		posts,
	} = await data.json();

	return (
		<>
			<PostHeading
				userName={userName}
				displayName={displayName}
				profilePicture={profilePicture}
			/>
		  {posts.map((post) => <PostDisplay key={post.id} {...post} />)}
		</>
	);
}
