import './globals.css';

import Timeline from './components/Timeline';

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
      <Timeline />
      <Footer />
    </>
  );
}
