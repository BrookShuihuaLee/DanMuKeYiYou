/**
 * Created by Brook on 2016/5/14.
 */
import config from '../config.js';
import mongorito from 'mongorito';
import Message from './Message.js';

export default class {
    constructor() {
        mongorito.connect(config.MONGO_URL);
        this._removingOldMessages = new Set();
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
                console.log(`移除${url}的${num >> 1}条数据`);
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
            .sort({
                updated_at: -1
            })
            .limit(config.MAX_MESSAGE_NUM_OF_SINGLE_URL)
            .find({
                url: url
            }).then(function (oldMessages) {
                return Promise.resolve(oldMessages.map(Message._toObject));
            });
    }
}