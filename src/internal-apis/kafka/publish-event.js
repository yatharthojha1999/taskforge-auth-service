
module.exports = function makePublishEvent({
    axios,
    kafkaService,
}) {
    return async function publishEvent({
        topic,
        key,
        event,
    }) {
        console.log("Kafka Service API called", {
            topic,
            key,
        });

        try {
            const kafkaServiceClient = axios.create({
                baseURL: kafkaService,
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const payload = {
                topic,
                event,
            };

            if (key !== undefined && key !== null) {
                payload.key = key;
            }

            const response = await kafkaServiceClient.post(
                "/publish",
                payload
            );

            return response.data;
        } catch (e) {
            console.error(
                "Kafka Service Internal API Error:",
                e.response?.data || e.message
            );

            throw e;
        }
    };
};
