export default function SignUp() {
  return (
		<form>
			<label>
				Email address
				<input type="email" />
			</label>
			<label>
				Confirm email address
				<input type="email" />
			</label>
			<label>
				Username
				<input type="text" />
			</label>
			<label>
				Display name
				<input type="email" />
			</label>
			<label>
				Password
				<input type="password" />
			</label>
			<label>
				Confirm password
				<input type="password" />
			</label>
			<button type="submit">Submit</button>
		</form>
	);
}
