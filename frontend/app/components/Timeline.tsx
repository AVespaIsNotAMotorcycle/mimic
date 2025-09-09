'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface Post {
  id: string;
	userName: string;
	displayName: string;
	profilePicture: string;
	text: string;
};

export function PostHeading({
	userName,
	displayName,
	profilePicture,
}) {
	return (
		<div className="post-heading">
	  	<img src={profilePicture} />
			<div className="names">
			  <span>{displayName}</span>
			  <a href={`/user/${userName}`}>@{userName}</a>
			</div>
		</div>
	);
}

export function PostDisplay({
	userName,
	displayName,
	profilePicture,
	text,
}) {
  return (
	  <article className="post">
			<PostHeading
				userName={userName}
				displayName={displayName}
				profilePicture={profilePicture}
			/>
			<p>
			  {text}
		  </p>
			<div className="footing">
				<span className="likes">
					<FavoriteBorderIcon />
					324
				</span>
				<span className="reposts">
					<RepeatIcon />
					34
				</span>
				<span className="comments">
					<ChatBubbleOutlineIcon />
					23
				</span>
			</div>
	  </article>
	);
}

function ComposePost() {
  return (
		<form className="composepost">
			<textarea />
			<button type="submit">Post</button>
		</form>
	);
}

export default function Timeline() {
  const [errorMessage, setErrorMessage] = useState<string>();
	const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
	  console.log('called useEffect');
	  axios.get('http://localhost:8000/posts')
			.then(({ data }) => setPosts(data))
			.catch(({ message }) => { setErrorMessage(`Something went wrong: ${message}`); });
	}, []);

  const postsLoaded : bool = posts !== undefined;
	const postsExist : bool = postsLoaded && posts.length > 0;
  return (
	  <>
			<ComposePost />
			{!postsLoaded && 'Loading...'}
		  {postsLoaded && posts.map((post) => <PostDisplay key={post.id} {...post} />)}
			{postsLoaded && !postsExist && 'No posts were found.'}
		</>
	);
}
