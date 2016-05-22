/**
 * Created by Brook on 2016/5/21.
 */
import self from 'sdk/self';
import PAGE_WORKER from 'sdk/page-worker';

export default new class {
    constructor() {
        this._page = PAGE_WORKER.Page({
            contentURL: self.data.url('./pageWorker/pageWorker.html'),
            onMessage: console.log
        });
    }
};