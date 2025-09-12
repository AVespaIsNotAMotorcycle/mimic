import EmailIcon from '@mui/icons-material/Email';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';

const buttons = [
	{ icon: <HomeIcon />, label: 'Home', href: '/' },
  { icon: <AccountBoxIcon />, label: 'Profile' },
  { icon: <AccountBoxIcon />, label: 'Sign Up' },
  { icon: <EmailIcon />, label: 'Messages' },
];

function labelToURL(label: string) : string {
  return label.toLowerCase().replaceAll(' ', '_');
}

export default function Header() {
  return (
	  <header>
			<span className="logo">MIMIC</span>
			<nav>
				<ul>
					{buttons.map(({ icon, label, href }) => (
					  <li key={label}>
							<a href={href || `/${labelToURL(label)}`}>
								{icon}
								{label}
					  	</a>
					  </li>
					))}
				</ul>
			</nav>
		</header>
	);
}
