'use client'

import axios from 'axios';
import { useState, useEffect } from 'react';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import Image from './Image';
import ComposePost from './ComposePost';
import Tabs from './Tabs';
import PostDisplay from './Post';

import { getCredentials } from '../utils';

interface Post {
  id: string;
	userName: string;
	displayName: string;
	text: string;
};

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
			? '/posts'
			: `/posts/followed/${userName}`
		axios.get(endpoint).then(({ data }) => setPosts(data));
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
