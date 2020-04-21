import server from './server'


const options = { port: (process.env.APOLLO_PORT || process.env.PORT) || 4444 };


server.listen(options).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
