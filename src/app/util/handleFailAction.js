exports.handleFailAction = async (request, reply, source, error) => {
    try{
        let errPayload = error.output;
        return reply(errPayload.payload).code(errPayload.statusCode);
    } catch(e) {
        console.error('failAction:', e);
        return reply("Internal Server Error").code(500);
    }
}