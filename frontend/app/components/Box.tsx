export default function Box({ className, children }) {
	return (
		<div className={`${className} box`}>
			{children}
		</div>
	);
}
