import Post from '../../components/Post';
import ComposePost from '../../components/ComposePost';

export default async function PostPage({
	params,
}: {
	params: Promise<{ postID: string }>,
}) {
	const { postID } = await params;
  const data = await fetch(`http://localhost:8000/posts/${postID}`);
	const post = await data.json();
	return (
		<>
			{post.replyTo && <Post {...post.replyTo} />}
			<Post {...post} noLink />
			<ComposePost
				prompt={`Reply to @${post.userName}`}
				replyTo={postID}
			/>
			{post.replies.map((reply) => <Post key={reply._id} {...reply} />)}
		</>
	);
}
