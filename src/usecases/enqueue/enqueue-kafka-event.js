
module.exports = function makeEnqueueKafkaEvent({
    Joi,
    kafkaService,
    makeAppError,
}) {
    return async function enqueueKafkaEvent({
        topic,
        event,
    }) {
        const schema = Joi.object({
            topic: Joi.string().trim().required(),
            event: Joi.object().required(),
        }).unknown(false);

        const { error: validationError, value } =
            schema.validate(
                { topic, event },
                {
                    abortEarly: false,
                    convert: true,
                }
            );

        if (validationError) {
            throw makeAppError(
                validationError.details
                    .map((detail) => detail.message)
                    .join(", "),
                400
            );
        }

        try {
            return await kafkaService.publishEvent({
                topic: value.topic,
                event: value.event,
            });
        } catch (error) {
            throw makeAppError(
                "Failed to enqueue Kafka event",
                502
            );
        }
    };
};
