import './globals.css';

function Header() {
  return (
	  <header>
			MIMIC
			<nav>
				<ul>
					<li><a href="home">Home</a></li>
					<li><a href="profile">Profile</a></li>
					<li><a href="messages">Messages</a></li>
				</ul>
			</nav>
		</header>
	);
}

function Post() {

  const profilePicture : string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Gustav_Klimt_046.jpg/1200px-Gustav_Klimt_046.jpg';
  const displayName : string = 'John Doe';
  const userName : string = 'test_poster';
  const content : string = 'Lorem ipsum dolor sit amet.';

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
			  {content}
		  </p>
	  </article>
	);
}

function Main() {
  return (
	  <main>
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
			<Post />
		</main>
	);
}

function Footer() {
  return (
	  <footer>
			footer
		</footer>
	);
}

export default function Home() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
