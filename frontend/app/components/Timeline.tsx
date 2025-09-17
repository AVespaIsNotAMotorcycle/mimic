'use client'

import { useState, useEffect } from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import Image from './Image';
import ComposePost from './ComposePost';
import Tabs from './Tabs';

interface Post {
  id: string;
	userName: string;
	displayName: string;
	text: string;
};

export function PostHeading({
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

export function PostDisplay({
	userName,
	displayName,
	text,
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

const TIMELINE_MODES = [
  { id: 'all', label: 'All posts' },
  { id: 'following', label: 'Following' },
];
export default function Timeline() {
	const [posts, setPosts] = useState([]);
	const [timelineMode, setTimelineMode] = useState('all');

	useEffect(() => {
		const userName = localStorage.getItem('userName');
		const endpoint = timelineMode === 'all'
			? 'http://localhost:8000/posts'
			: `http://localhost:8000/posts/followed/${userName}`
		fetch(endpoint)
			.then((data) => data.json().then(setPosts));
	}, [timelineMode]);

  return (
	  <>
			<Tabs
				tabs={TIMELINE_MODES}
				selected={timelineMode}
				onChange={setTimelineMode}
			/>
			<ComposePost />
		  {posts.map((post) => <PostDisplay key={post._id} {...post} />)}
		</>
	);
}
