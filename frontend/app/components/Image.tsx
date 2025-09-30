import NextJSImage from 'next/image';

interface Props {
	source: string,
	pathType: 'userName' | 'relativeToImages',
	className?: string,
	alt: '',
}

function getURL(
	pathType: Props['pathType'],
	source: Props['source'],
) {
	const prePath = 'http://localhost:8000';
	switch (pathType) {
		case 'userName': return `${prePath}/user/${source}/profilePicture`;
		default: return `${prePath}/images/${source}`;
	}
}

export default function Image(props: Props) {
	const {
		source,
		className,
		pathType = 'relativeToImages',
		alt,
	} = props;
	return (
		<NextJSImage
			src={getURL(pathType, source)}
			className={className}
			alt={alt}
		/>
	);
}
