import './globals.css';

import Timeline from './components/Timeline';
import Sidebar from './components/Sidebar';

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
      <Sidebar />
      <Timeline />
      <Footer />
    </>
  );
}
