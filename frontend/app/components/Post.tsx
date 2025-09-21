'use client';

import { useEffect, useState } from 'react';

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import axios from 'axios';

import { getCredentials } from '../utils';
import ComposePost from './ComposePost';
import Image from './Image';
import Loading from './Loading';
import Popup from './Popup';
import Tabs from './Tabs';

const DeletePostButton = ({
  postAuthor,
  postID,
  setDeleted,
  isQuote,
}) => {
  const [confirming, setConfirming] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(false);
  const { userName, authKey } = getCredentials();

  if (!postID) return null;
  if (!userName) return null;
  if (userName !== postAuthor) return null;
  if (isQuote) return null;

  function promptConfirm() {
    setConfirming(true);
  }
  function cancel() {
    setConfirming(false);
  }
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
    <React.Fragment>
      <button className="delete-post" type="button">
        <DeleteIcon onClick={promptConfirm} />
      </button>
      <Popup open={confirming}>
        Are you sure you want to delete this post?
        {pendingRequest ? <div><Loading /></div> : null}
        <div className="button-group">
          <button {...sharedButtonProps} onClick={cancel}>Cancel</button>
          <button {...sharedButtonProps} onClick={confirm}>Confirm</button>
        </div>
      </Popup>
    </React.Fragment>
  );
};

const PostHeading = ({
  userName,
  displayName,
  replyTo,
  postID,
  setDeleted,
  isQuote,
  placeholder,
}) => {
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
        className="profile-picture"
        pathType="userName"
        source={userName}
      />
      <div className="names">
        <span>{displayName}</span>
        <a href={`/user/${userName}`}>
          @
          {userName}
        </a>
        {replyTo ? (
          <span>
            {'Reply to '}
            {typeof replyTo === 'string'
              ? <a href={`post/${replyTo}`}>this post</a>
              : <a href={`post/${replyTo.userName}`}>{`@${replyTo.userName}`}</a>}
          </span>
        ) : null}
      </div>
      <DeletePostButton
        isQuote={isQuote}
        postAuthor={userName}
        postID={postID}
        setDeleted={setDeleted}
      />
    </div>
  );
};

function likesCount(likes) {
  if (!Array.isArray(likes)) return 0;
  return likes.length;
}
function userLikedPost(likes, userName) {
  if (!Array.isArray(likes)) return false;
  return likes.includes(userName);
}

const QuoteForm = ({ open, quoteOf, closeFunction }) => (
  <Popup open={open}>
    <ComposePost
      onSuccess={closeFunction}
      quoteOf={quoteOf}
    />
  </Popup>
);

const PostFooting = ({
  postID,
  likes: initialLikes,
  replies,
  quotes: initialQuotes,
  isQuote,
  placeholder,
}) => {
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
    <React.Fragment>
      <div className="footing">
        <button
          disabled={noCredentials}
          onClick={togglePostLike}
          className={[
            'likes',
            userLikedPost(likes, userName) ? 'liked' : 'not-liked',
          ].join(' ')}
        >
          <FavoriteBorderIcon />
          {likesCount(likes)}
        </button>
        <button
          className="reposts"
          onClick={() => {
            setQuoting(true);
          }}
        >
          <RepeatIcon />
          {quotes.length}
        </button>
        <button className="comments">
          <ChatBubbleOutlineIcon />
          {replies.length}
        </button>
      </div>
      <QuoteForm
        closeFunction={onQuote}
        open={quoting}
        quoteOf={postID}
      />
    </React.Fragment>
  );
};

export default function Post({
  _id: postID,
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
}) {
  const [deleted, setDeleted] = useState(false);
  const [quotedPost, setQuotedPost] = useState();

  useEffect(() => {
    if (!quoteOf) return;
    if (quotedPost) return;
    if (isQuote) return;

    axios.get(`/posts/${quoteOf}`)
      .then(({ data }) => {
        setQuotedPost(data);
      });
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
        displayName={displayName}
        isQuote={isQuote}
        postID={postID}
        replyTo={replyTo}
        setDeleted={setDeleted}
        userName={userName}
      />
      {noLink
        ? <p className="post-text">{text}</p>
        : <a className="post-text" href={`/post/${postID}`}>{text}</a>}
      {!isQuote && quoteOf ? (
        <div className="quote">
          {quotedPost
            ? <Post {...quotedPost} isQuote />
            : <Post placeholder />}
        </div>
      ) : null}
      <PostFooting
        isQuote={isQuote}
        likes={likes}
        postID={postID}
        quotes={quotes}
        replies={replies}
      />
    </article>
  );
}
