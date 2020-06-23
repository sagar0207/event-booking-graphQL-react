const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
};

const user = async (userId) => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}

const transformBooking = result => {
    return {
        ...result._doc,
        _id: result.id,
        user: user.bind(this, result._doc.user),
        event: singleEvent.bind(this, result._doc.event),
        createdAt: dateToString(result._doc.createdAt),
        updatedAt: dateToString(result._doc.updatedAt)
    };
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;