const express = require('express')
const app = express()
const port = 8000

app.get('/posts', (req, res) => {
  res.send([
		{
			userName: '@test_poster',
			displayName: 'John Doe',
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu elit ut purus rhoncus finibus. Morbi rhoncus efficitur lorem, vitae placerat mauris tristique consequat.',
		},
		{
			userName: '@not_a_real_human',
			displayName: 'Hugh Mann',
			text: 'Quisque luctus sem non nisi congue, at blandit est sagittis. Proin sed dignissim erat. Suspendisse potenti. Proin et lacus enim.',
		},
		{
			userName: '@test_poster',
			displayName: 'John Doe',
			text: 'Quisque convallis ipsum non lobortis fringilla. Maecenas varius sollicitudin quam, eu laoreet dolor volutpat vitae. Sed lobortis nibh sit amet metus dignissim interdum. Vivamus a commodo dolor.',
		},
		{
			userName: '@someones_dog',
			displayName: 'Internet Dog',
			text: 'Sed placerat mauris cursus quam facilisis lacinia. Cras porttitor magna blandit tempor commodo. Proin purus augue, fermentum facilisis commodo vel, hendrerit et lacus.',
		},
	]);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

