'use client'

import { useState, useEffect } from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import { getCredentials } from '../utils';

import Image from './Image';
import ComposePost from './ComposePost';
import Tabs from './Tabs';
import Popup from './Popup';
import Loading from './Loading';

function DeletePostButton({
	postAuthor,
	postID,
	setDeleted,
	isQuote,
}) {
	const [confirming, setConfirming] = useState(false);
	const [pendingRequest, setPendingRequest] = useState(false);
	const { userName, authKey } = getCredentials();

	if (!postID) return null;
	if (!userName) return null;
	if (userName !== postAuthor) return null;
	if (isQuote) return null;

	function promptConfirm() { setConfirming(true); }
	function cancel() { setConfirming(false); }
	async function confirm() {
		setPendingRequest(true);

		const endpoint = `http://localhost:8000/posts/${postID}`;
		await fetch(endpoint, {
			method: 'DELETE',
			headers: { "Authorization": authKey },
		});

		setPendingRequest(false);
		setConfirming(false);
		setDeleted(true);
	}

	const sharedButtonProps = {
		type: 'button',
		disabled: pendingRequest,
	};
	return (
		<>
			<button className="delete-post" type="button">
				<DeleteIcon onClick={promptConfirm}/>
			</button>
			<Popup open={confirming}>
				Are you sure you want to delete this post?
				{pendingRequest && <div><Loading /></div>}
				<div className="button-group">
					<button {...sharedButtonProps} onClick={cancel}>Cancel</button>
					<button {...sharedButtonProps} onClick={confirm}>Confirm</button>
				</div>
			</Popup>
		</>
	);
}

function PostHeading({
	userName,
	displayName,
	replyTo,
	postID,
	setDeleted,
	isQuote,
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
			<DeletePostButton
				setDeleted={setDeleted}
				postID={postID}
				postAuthor={userName}
				isQuote={isQuote}
			/>
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

function QuoteForm({ open, quoteOf, closeFunction }) {
	return (
		<Popup open={open}>
			<ComposePost
				quoteOf={quoteOf}
				onSuccess={closeFunction}
			/>
		</Popup>
	);
}

function PostFooting({ postID, likes: initialLikes, replies }) {
	const [quoting, setQuoting] = useState(false);
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
		<>
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
				<button className="reposts" onClick={() => { setQuoting(true); }}>
					<RepeatIcon />
					0
				</button>
				<button className="comments">
					<ChatBubbleOutlineIcon />
					{replies.length}
				</button>
			</div>
			<QuoteForm
				open={quoting}
				quoteOf={postID}
				closeFunction={() => { setQuoting(false); }}
			/>
		</>
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
	quoteOf,
	isQuote,
}) {
	const [deleted, setDeleted] = useState(false);
	const [quotedPost, setQuotedPost] = useState();
	if (deleted) {
		return (
	  	<article className="post">
				This post has been deleted.
			</article>
		);
  }

	useEffect(() => {
		if (!quoteOf) return;
		if (quotedPost) return;
		if (isQuote) return;

		fetch(`http://localhost:8000/posts/${quoteOf}`)
			.then((post) => { post.json().then(setQuotedPost); });
	}, [quoteOf]);

	return (
	  <article className="post">
  		<PostHeading
  			userName={userName}
  			displayName={displayName}
				replyTo={replyTo}
				postID={postID}
				setDeleted={setDeleted}
				isQuote={isQuote}
  		/>
			{noLink
				? <p className="post-text">{text}</p>
				: <a className="post-text" href={`/post/${postID}`}>{text}</a>}
			{!isQuote && quoteOf && !quotedPost && <Loading />}
			{quotedPost && (
				<div className="quote">
					<Post {...quotedPost} isQuote />
				</div>
			)}
			{!isQuote && <PostFooting postID={postID} likes={likes} replies={replies} />}
	  </article>
	);
}
