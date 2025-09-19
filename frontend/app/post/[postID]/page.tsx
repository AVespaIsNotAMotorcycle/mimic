import Post from '../../components/Post';

export default async function PostPage({
	params,
}: {
	params: Promise<{ userName: string }>,
}) {
	const { postID } = await params;
  const data = await fetch(`http://localhost:8000/posts/${postID}`);
	const post = await data.json();
	return (
		<Post {...post} noLink />
	);
}
