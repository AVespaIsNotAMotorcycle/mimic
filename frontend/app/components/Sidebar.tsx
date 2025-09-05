import EmailIcon from '@mui/icons-material/Email';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';

const buttons = [
	{ icon: <HomeIcon />, label: 'Home' },
  { icon: <AccountBoxIcon />, label: 'Profile' },
  { icon: <EmailIcon />, label: 'Messages' },
];

export default function Header() {
  return (
	  <header>
			<span className="logo">MIMIC</span>
			<nav>
				<ul>
					{buttons.map(({ icon, label }) => (
					  <li key={label}>
							<a href={label}>
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
