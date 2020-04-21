function info() {
	return 'Welcome to Apollo-Prisma in Docker';
}

function test(_, __, ___) {
	console.log('Test Message')
	return 'This is a test.'
}


export default {
	test,
	info,
};
