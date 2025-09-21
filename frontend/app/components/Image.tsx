function getURL(pathType, source) {
	const prePath = 'http://localhost:8000';
	switch (pathType) {
		case 'userName': return `${prePath}/user/${source}/profilePicture`;
		default: return `${prePath}/images/${source}`;
	}
}

export default function Image({
	source,
	className,
	pathType = 'relativeToImages',
}) {
	return <img src={getURL(pathType, source)} className={className} />;
}
