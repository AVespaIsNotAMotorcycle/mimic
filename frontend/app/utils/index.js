export function getCredentials() {
  if (typeof localStorage === 'undefined') return undefined;
  const userName = localStorage.getItem('userName');
  const authKey = localStorage.getItem('authKey');
  return { userName, authKey };
}
