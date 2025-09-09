export default async function Profile({
	params,
}: {
	params: Promise<{ userName: string }>,
}) {
	const { userName } = await params;
	
	return (
		<h1>{userName}</h1>
	);
}
