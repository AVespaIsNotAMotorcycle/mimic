export default function Image({ source, className }) {
	const imagesURL = 'http://localhost:8000/images';
	const imageSource = `${imagesURL}/${source}`;
	return <img src={imageSource} className={className} />;
}
