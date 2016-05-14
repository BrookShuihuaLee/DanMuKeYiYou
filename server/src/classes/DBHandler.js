/**
 * Created by Brook on 2016/5/14.
 */
import config from '../config.js';
import mongorito, { Model } from 'mongorito';

class Message extends Model {
    static _toObject(message) {
        return ModelToObject(message, ['url', 'text', 'fontSize', 'direction']);
    }
}

function ModelToObject(m, attributes) {
    let o = {};
    for (let attribute of attributes) {
        o[attribute] = m.get(attribute);
    }
    return o;
}

export default class {
    constructor() {
        mongorito.connect(config.MONGO_URL);
        this._removingOldMessages = new Set();
        for (let i = 0; i < 100; i++) {
            this.addMessage({
                url: 'haha',
                text: 'jjjjj'
            });
        }
    }

    addMessage(message) {
        new Message(message)
            .save()
            .then(() => {
                return this._removeOldMessages(message.url);
            }).catch(console.log);
    }

    _removeOldMessages(url) {
        if (this._removingOldMessages.has(url)) return;
        this._removingOldMessages.add(url);
        return Message.count({
            url: url
        }).then(num => {
            if (num >= (config.MAX_MESSAGE_NUM_OF_SINGLE_URL << 1)) {
                return Message
                    .sort({
                        updated_at: 1
                    })
                    .skip(num >> 1)
                    .findOne({
                        url: url
                    });
            }
        }).then(message => {
            if (message) {
                return Message
                    .remove({
                        url: url,
                        updated_at: {
                            $lt: message.get('updated_at')
                        }
                    });
            }
        }).then(() => {
            this._removingOldMessages.delete(url);
        });
    }

    getOldMessages(url) {
        return Message
            .limit(config.MAX_MESSAGE_NUM_OF_SINGLE_URL)
            .find({
                url: url
            }).then(function (oldMessages) {
                return Promise.resolve(oldMessages.map(Message._toObject));
            });
    }
};