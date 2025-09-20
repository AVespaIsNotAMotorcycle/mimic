'use client'

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Loading from '../../components/Loading';
import Post from '../../components/Post';
import ComposePost from '../../components/ComposePost';

export default function PostPage() {
	const { postID } = useParams();
	const [post, setPost] = useState();

	useEffect(() => {
  	axios.get(`/posts/${postID}`).then(({ data }) => { setPost(data); });
	}, []);

	if (!post) return <Loading />;
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
