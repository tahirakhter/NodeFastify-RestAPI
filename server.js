const routes = require('./app/routes');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to DB
mongoose.connect(process.env.DB_URL).then(() => {
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
        await fastify.listen(process.env.PORT);
        fastify.log.info('listening on ${fastify.server.address().port}');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1)
    }
}
start()