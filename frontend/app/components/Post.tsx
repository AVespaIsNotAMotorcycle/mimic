'use client'

import axios from 'axios';
import { useState, useEffect } from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

import { getCredentials } from '../utils';

import Image from './Image';
import ComposePost from './ComposePost';
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
	const { userName } = getCredentials();

	if (!postID) return null;
	if (!userName) return null;
	if (userName !== postAuthor) return null;
	if (isQuote) return null;

	function promptConfirm() { setConfirming(true); }
	function cancel() { setConfirming(false); }
	async function confirm() {
		setPendingRequest(true);

		const endpoint = `/posts/${postID}`;
		await axios.delete(endpoint);

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
	placeholder,
}) {
	if (placeholder) {
		return (
			<div className="post-heading placeholder">
				<div className="profile-picture placeholder" />
				<div className="names">
					<div className="display-name placeholder" />
					<div className="user-name placeholder" />
				</div>
			</div>
		);
	}
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
				canCancel
				onCancel={closeFunction}
			/>
		</Popup>
	);
}

function PostFooting({
	postID,
	likes: initialLikes,
	replies,
	quotes: initialQuotes,
	isQuote,
	placeholder,
}) {
	const [quoting, setQuoting] = useState(false);

	const [quotes, setQuotes] = useState(Array.isArray(initialQuotes)
		? initialQuotes
		: []);
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
		const endpoint = `/posts/${postID}/${action}`;
		axios.put(endpoint);
		if (action === 'like') setLikes([...likes, userName]);
		if (action === 'unlike') setLikes(likes.filter((name) => name !== userName));
	}
	function onQuote(quoteID) {
		setQuoting(false);
		setQuotes([...quotes, quoteID]);
	}

	if (isQuote) return null;
	if (placeholder) return <div className="footing placeholder" />;
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
					{quotes.length}
				</button>
				<button className="comments">
					<ChatBubbleOutlineIcon />
					{replies.length}
				</button>
			</div>
			<QuoteForm
				open={quoting}
				quoteOf={postID}
				closeFunction={onQuote}
			/>
		</>
	);
}

function numeralToText(numeral) {
  switch (numeral) {
    case 1: return 'one';
    case 2: return 'two';
    case 3: return 'three';
    case 4: return 'four';
    default: return 'zero';
  }
}
function PostImages({ images = [] }) {
  const [viewedImage, setViewedImage] = useState(null);
  const viewing = typeof viewedImage === 'number'
    && viewedImage >= 0
    && viewedImage < images.length;
  if (!images.length) return null;
  return (
    <div className={`post-images ${numeralToText(images.length)}-count`}>
      {images.map((source, index) => (
        <button
          key={source}
          type="button"
          className="image-wrapper"
          onClick={() => { setViewedImage(index); }}
        >
          <Image source={source} />
        </button>
      ))}
      <Popup open={viewing}>
        <Image source={viewing ? images[viewedImage] : images[0]} />
        <button type="button" onClick={() => { setViewedImage(null)}}>
          Close
        </button>
      </Popup>
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
	quoteOf,
	isQuote,
	quotes,
	placeholder,
  images = [],
}) {
	const [deleted, setDeleted] = useState(false);
	const [quotedPost, setQuotedPost] = useState();

	useEffect(() => {
		if (!quoteOf) return;
		if (quotedPost) return;
		if (isQuote) return;

		axios.get(`/posts/${quoteOf}`)
			.then(({ data }) => { setQuotedPost(data); });
	}, [quoteOf]);

	if (deleted) {
		return (
	  	<article className="post">
				This post has been deleted.
			</article>
		);
  }
	if (placeholder) {
		return (
			<article className="post placeholder">
				<PostHeading placeholder />
				<div className="post-text placeholder">
					<div className="row placeholder" />
					<div className="row placeholder" />
					<div className="row placeholder" />
				</div>
				<PostFooting placeholder />
			</article>
		);
	}
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
        <PostImages images={images} />
				{!isQuote && quoteOf && (
				<div className="quote">
					{quotedPost
						? <Post {...quotedPost} isQuote />
						: <Post placeholder />}
				</div>
			)}
			<PostFooting
				postID={postID}
				likes={likes}
				replies={replies}
				isQuote={isQuote}
				quotes={quotes}
			/>
	  </article>
	);
}
