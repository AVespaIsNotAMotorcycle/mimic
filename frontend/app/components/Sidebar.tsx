'use client'

import { useEffect, useState } from 'react';

import EmailIcon from '@mui/icons-material/Email';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const HOME_BUTTON = { icon: <HomeIcon />, label: 'Home', href: '/' };
const MESSAGES_BUTTON = { icon: <EmailIcon />, label: 'Messages' };
const PROFILE_BUTTON = { icon: <AccountBoxIcon />, label: 'Profile' };
const LOGIN_BUTTON = { icon: <AccountBoxIcon />, label: 'Log in', href: '/login' };
const LOGOUT_BUTTON = { icon: <AccountBoxIcon />, label: 'Log out', href: '/logout' };

const LOGGED_OUT_BUTTONS = [
	HOME_BUTTON,
	LOGIN_BUTTON,
];
const LOGGED_IN_BUTTONS = [
	HOME_BUTTON,
	MESSAGES_BUTTON,
	PROFILE_BUTTON,
	LOGOUT_BUTTON,
];

function labelToURL(label: string) : string {
  return label.toLowerCase().replaceAll(' ', '_');
}

export default function Header() {
	const [buttons, setButtons] = useState([]);

	useEffect(() => {
		const userName = localStorage.getItem('userName');
		if (userName) {
			PROFILE_BUTTON.href = `/user/${userName}`;
			setButtons([...LOGGED_IN_BUTTONS]);
		} else {
			setButtons([...LOGGED_OUT_BUTTONS]);
		}
	}, []);

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
