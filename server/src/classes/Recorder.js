/**
 * Created by Brook on 2016/5/17.
 */
export default new class {
    constructor() {
        this.startDate = new Date();
        this.messageNum = 0;
    }

    addOneMessage() {
        this.messageNum++;
    }

    toString() {
        return `
            开始：${this.startDate}<br/>
            现在：${new Date()}<br/>
            messageNum: ${this.messageNum}`;
    }
};