/**
 * Created by Brook on 2016/5/15.
 */
import { Model } from 'mongorito';

function ModelToObject(m, attributes) {
    let o = {};
    for (let attribute of attributes) {
        o[attribute] = m.get(attribute);
    }
    return o;
}

export default class Message extends Model {
    static _getAttrs() {
        return ['url', 'text', 'color', 'fontSize', 'direction'];
    }

    static _validateObject(o) {
        return Message._getAttrs().every(attr => o[attr]);
    }

    static _toObject(message) {
        return ModelToObject(message, Message._getAttrs());
    }
}