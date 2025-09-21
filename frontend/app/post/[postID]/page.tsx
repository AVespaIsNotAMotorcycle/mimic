'use client';

import { useEffect, useState } from 'react';

import axios from 'axios';
import { useParams } from 'next/navigation';

import ComposePost from '../../components/ComposePost';
import Loading from '../../components/Loading';
import Post from '../../components/Post';

export default function PostPage() {
  const { postID } = useParams();
  const [post, setPost] = useState();

  useEffect(() => {
    axios.get(`/posts/${postID}`).then(({ data }) => {
      setPost(data);
    });
  }, []);

  if (!post) return <Loading />;
  return (
    <React.Fragment>
      {post.replyTo ? <Post {...post.replyTo} /> : null}
      <Post {...post} noLink />
      <ComposePost
        prompt={`Reply to @${post.userName}`}
        replyTo={postID}
      />
      {post.replies.map((reply) => <Post key={reply._id} {...reply} />)}
    </React.Fragment>
  );
}
