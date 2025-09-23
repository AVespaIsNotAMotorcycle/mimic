'use client'

import { useEffect } from 'react';

export default function LogOut() {
	useEffect(() => {
		localStorage.removeItem('userName');
		localStorage.removeItem('authKey');
		window.location.assign('..');
	}, [])

  return (
		<h1 className="center">Logging out...</h1>
	);
}
