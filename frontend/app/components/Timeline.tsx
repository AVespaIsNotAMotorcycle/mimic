'use client'

import axios from 'axios';
import { useState, useEffect } from 'react';

import ComposePost from './ComposePost';
import Tabs from './Tabs';
import PostDisplay from './Post';

function FailedLoadMessage() {
	return (
		<div className="failed-load">
			No posts could be loaded.
		</div>
	);
}
function LoadingPlaceholders() {
	return (
		<div className="timeline-placeholder">
			<PostDisplay placeholder />
			<PostDisplay placeholder />
			<PostDisplay placeholder />
			<PostDisplay placeholder />
			<PostDisplay placeholder />
			<PostDisplay placeholder />
			<PostDisplay placeholder />
			<PostDisplay placeholder />
			<PostDisplay placeholder />
			<PostDisplay placeholder />
		</div>
	);
}

const TIMELINE_MODES = [
  { id: 'all', label: 'All posts' },
  { id: 'following', label: 'Following' },
];
export default function Timeline() {
	const [posts, setPosts] = useState([]);
	const [timelineMode, setTimelineMode] = useState('all');
	const [loading, setLoading] = useState(true);

	function loadPosts () {
		setLoading(true);
		const userName = localStorage.getItem('userName');
		const endpoint = timelineMode === 'all'
			? '/posts'
			: `/posts/followed/${userName}`
		axios.get(endpoint)
			.then(({ data }) => {
				setPosts(data);
				setLoading(false);
			})
			.catch(() => { setLoading(false); });
	}
	useEffect(loadPosts, [timelineMode]);

  return (
	  <>
			<Tabs
				tabs={TIMELINE_MODES}
				selected={timelineMode}
				onChange={setTimelineMode}
			/>
			<ComposePost onSuccess={loadPosts} />
			{loading && <LoadingPlaceholders />}
		  {!loading && posts.map((post) => <PostDisplay key={post._id} {...post} />)}
			{!loading && !posts.length && <FailedLoadMessage />}
		</>
	);
}
