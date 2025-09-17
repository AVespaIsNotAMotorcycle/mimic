'use client'

import { useState, useEffect } from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import { getCredentials } from '../utils';

import Image from './Image';
import ComposePost from './ComposePost';
import Tabs from './Tabs';

function PostHeading({
	userName,
	displayName,
}) {
	return (
		<div className="post-heading">
	  	<Image
				source={userName}
				pathType="userName"
				className="profile-picture"
			/>
			<div className="names">
			  <span>{displayName}</span>
			  <a href={`/user/${userName}`}>@{userName}</a>
			</div>
		</div>
	);
}

function likesCount(likes) {
	if (!Array.isArray(likes)) return 0;
	return likes.length;
}
function userLikedPost(likes, userName) {
	if (!Array.isArray(likes)) return false;
	return likes.includes(userName);
}

function PostFooting({ postID, likes: initialLikes }) {
	const [likes, setLikes] = useState(initialLikes);
	const credentials = getCredentials();
	const noCredentials = typeof credentials !== 'object'
		|| !credentials.authKey
		|| !credentials.userName;

	const userName = noCredentials ? '' : credentials.userName;
	async function togglePostLike() {
		const action = userLikedPost(likes, userName) ? 'unlike' : 'like';
		const endpoint = `http://localhost:8000/posts/${postID}/${action}`;
		fetch(endpoint, {
			method: 'PUT',
			headers: { "Authorization": credentials.authKey },
		});
		if (action === 'like') setLikes([...likes, userName]);
		if (action === 'unlike') setLikes(likes.filter((name) => name !== userName));
	}

	return (
		<div className="footing">
			<button
				className={[
					'likes',
					userLikedPost(likes, userName) ? 'liked' : 'not-liked',
				].join(' ')}
				onClick={togglePostLike}
				disabled={noCredentials}
			>
				<FavoriteBorderIcon />
				{likesCount(likes)}
			</button>
			<button className="reposts">
				<RepeatIcon />
				0
			</button>
			<button className="comments">
				<ChatBubbleOutlineIcon />
				0
			</button>
		</div>
	);
}

export default function Post({
	_id : postID,
	userName,
	displayName,
	text,
	likes,
}) {
  return (
	  <article className="post">
			<PostHeading
				userName={userName}
				displayName={displayName}
			/>
			<p>
			  {text}
		  </p>
			<PostFooting postID={postID} likes={likes} />
	  </article>
	);
}
