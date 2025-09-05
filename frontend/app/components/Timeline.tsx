'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Post {
  id: string;
	userName: string;
	displayName: string;
	profilePicture: string;
	text: string;
};

function PostDisplay({
	userName,
	displayName,
	profilePicture,
	text,
}) {
  return (
	  <article className="post">
			<div className="heading">
		  	<img src={profilePicture} />
				<div className="names">
				  <span>{displayName}</span>
				  <a href={`/user/${userName}`}>@{userName}</a>
				</div>
			</div>
			<p>
			  {text}
		  </p>
	  </article>
	);
}

export default function Timeline() {
  const [errorMessage, setErrorMessage] = useState<string>();
	const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
	  console.log('called useEffect');
	  axios.get('http://localhost:8000/posts')
			.then(({ data }) => setPosts(data))
			.catch(({ message }) => { setErrorMessage(`Something went wrong: ${message}`); });
	}, []);

  const postsLoaded : bool = posts !== undefined;
	const postsExist : bool = postsLoaded && posts.length > 0;
  return (
	  <main>
			{!postsLoaded && 'Loading...'}
		  {postsLoaded && posts.map((post) => <PostDisplay key={post.id} {...post} />)}
			{postsLoaded && !postsExist && 'No posts were found.'}
		</main>
	);
}
