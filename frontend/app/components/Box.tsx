import { ReactNode } from 'react';

export default function Box(props: {
	className : string;
	children : ReactNode;
}) {
	const { className, children } = props;
	return (
		<div className={`${className} box`}>
			{children}
		</div>
	);
}
