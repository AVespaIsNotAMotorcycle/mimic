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
	replyTo,
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
				{replyTo && (
					<span>
						{'Reply to '}
						{typeof replyTo === 'string'
							? <a href={`post/${replyTo}`}>this post</a>
							: <a href={`post/${replyTo.userName}`}>{`@${replyTo.userName}`}</a>}
					</span>
				)}
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

function PostFooting({ postID, likes: initialLikes, replies }) {
	const [likes, setLikes] = useState(Array.isArray(initialLikes)
		? initialLikes
		: []);
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
				{replies.length}
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
	noLink = false,
	replies = [],
	replyTo,
}) {
  return (
	  <article className="post">
  		<PostHeading
  			userName={userName}
  			displayName={displayName}
				replyTo={replyTo}
  		/>
			{noLink
				? <p className="post-text">{text}</p>
				: <a className="post-text" href={`/post/${postID}`}>{text}</a>}
			<PostFooting postID={postID} likes={likes} replies={replies} />
	  </article>
	);
}
