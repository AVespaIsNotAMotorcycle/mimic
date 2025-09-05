function Post({
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
				  <span>@{userName}</span>
				</div>
			</div>
			<p>
			  {text}
		  </p>
	  </article>
	);
}

export default function Timeline() {
  let posts: object[] = [{
	  userName: 'test_poster',
		displayName: 'John Doe',
		text: 'Lorem ipsum',
		profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Gustav_Klimt_046.jpg/1200px-Gustav_Klimt_046.jpg',
	}];

  return (
	  <main>
		  {posts.map((post) => <Post {...post} />)}
		</main>
	);
}
