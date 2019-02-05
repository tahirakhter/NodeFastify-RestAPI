const routes = require('./app/routes');
const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb://localhost/todoApi').then(() => {
    console.log("MongoDB connected…")
}).catch((err) => {
    console.log(err)
});

// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
})

// Declare a route
fastify.get('/', async (request, reply) => {
    return {hello: 'world'}
})

routes.forEach((route, index) => {
    fastify.route(route)
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000);
        fastify.log.info('listening on ${fastify.server.address().port}');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1)
    }
}
start()