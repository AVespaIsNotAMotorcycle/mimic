'use client'

import axios from 'axios';
import { useEffect } from 'react';

import { getCredentials } from '../utils';

export default function AxiosGlobals() {
	const authKey: string = getCredentials().authKey;
	useEffect(() => { axios.defaults.baseURL = 'http://localhost:8000'; }, []);
	useEffect(() => {
		if (!authKey) return ;
		axios.defaults.headers.common['Authorization'] = authKey;
	}, [authKey]);
	return <div />;
}
