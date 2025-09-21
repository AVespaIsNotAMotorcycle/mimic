'use client'

import axios from 'axios';
import { useEffect } from 'react';

import { getCredentials } from '../utils';

export default function AxiosGlobals() {
	useEffect(() => { axios.defaults.baseURL = 'http://localhost:8000'; }, []);
	useEffect(() => {
		if (!getCredentials()) return;
		axios.defaults.headers.common['Authorization'] = getCredentials().authKey;
	}, [getCredentials()]);
	return <div />;
}
