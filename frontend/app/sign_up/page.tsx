import Input from '../components/Input';

const FORM = {
  email1: {
		type: 'email',
		label: 'Email address',
	},
	email2: {
		type: 'email',
		label: 'Confirm email address',
	},
	username: {
		label: 'Username',
	},
	displayname: {
		label: 'Display name',
	},
	password1: {
		type: 'password',
		label: 'Password',
	},
	password2: {
		type: 'password',
		label: 'Confirm password',
	},
};

export default function SignUp() {
  return (
		<form>
			{Object.entries(FORM).map(([key, { label, type}]) => (
				<Input key={key} inputID={key} label={label} type={type} />
			))}
			<button type="submit">Submit</button>
		</form>
	);
}
