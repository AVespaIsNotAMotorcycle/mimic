import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import ComposePost from './ComposePost';

interface Post {
  id: string;
	userName: string;
	displayName: string;
	profilePicture: string;
	text: string;
};

export function PostHeading({
	userName,
	displayName,
	profilePicture,
}) {
	return (
		<div className="post-heading">
	  	<img src={profilePicture} />
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
	profilePicture,
	text,
}) {
  return (
	  <article className="post">
			<PostHeading
				userName={userName}
				displayName={displayName}
				profilePicture={profilePicture}
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

export default async function Timeline() {
	const data = await fetch('http://localhost:8000/posts');
  const posts = await data.json();

  return (
	  <>
			<ComposePost />
		  {posts.map((post) => <PostDisplay key={post._id} {...post} />)}
		</>
	);
}
