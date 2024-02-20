const eventCallbacks = {}

function subscribeEvent(event_type, callback) {
    if (!(event_type in eventCallbacks)) {
        eventCallbacks[event_type] = [];
    };

    eventCallbacks[event_type].push(callback)
};

function publishEvent(event_type, data) {
    if (!(event_type in eventCallbacks)) return;

    eventCallbacks[event_type].forEach((cb) => {
        cb(data);
    });
};

export { subscribeEvent, publishEvent };
