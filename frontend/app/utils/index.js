export function getCredentials() {
	if (typeof localStorage === 'undefined') return undefined;
	const userName = localStorage.getItem('userName');
	const authKey = localStorage.getItem('authKey');
	return { userName, authKey };
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
