export function getCredentials() {
	const credentials = {
		userName: '',
		authKey: '',
	};
	if (typeof localStorage === 'undefined') return credentials;
	credentials.userName = localStorage.getItem('userName');
	credentials.authKey = localStorage.getItem('authKey');
	return credentials;
}

export function createMultipartData(formData) {
	const multipartData = new FormData();
	Object.entries(formData)
		.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((element) => { multipartData.append(key, element); });
        return;
      }
			multipartData.append(key, value);
		});
	return multipartData;
}
