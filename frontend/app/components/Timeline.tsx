'use client';

import { useEffect, useState } from 'react';

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import axios from 'axios';

import ComposePost from './ComposePost';
import Image from './Image';
import PostDisplay from './Post';
import Tabs from './Tabs';
import { getCredentials } from '../utils';

interface Post {
  id: string;
  userName: string;
  displayName: string;
  text: string;
}

const FailedLoadMessage = () => (
  <div className="failed-load">
    No posts could be loaded.
  </div>
);
const LoadingPlaceholders = () => (
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

const TIMELINE_MODES = [
  { id: 'all', label: 'All posts' },
  { id: 'following', label: 'Following' },
];
export default function Timeline() {
  const [posts, setPosts] = useState([]);
  const [timelineMode, setTimelineMode] = useState('all');
  const [loading, setLoading] = useState(true);

  function loadPosts() {
    setLoading(true);
    const userName = localStorage.getItem('userName');
    const endpoint = timelineMode === 'all'
      ? '/posts'
      : `/posts/followed/${userName}`;
    axios.get(endpoint)
      .then(({ data }) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }
  useEffect(loadPosts, [timelineMode]);

  return (
    <React.Fragment>
      <Tabs
        onChange={setTimelineMode}
        selected={timelineMode}
        tabs={TIMELINE_MODES}
      />
      <ComposePost onSuccess={loadPosts} />
      {loading ? <LoadingPlaceholders /> : null}
      {!loading && posts.map((post) => <PostDisplay key={post._id} {...post} />)}
      {!loading && !posts.length && <FailedLoadMessage />}
    </React.Fragment>
  );
}
