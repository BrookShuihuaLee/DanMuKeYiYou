/**
 * Created by Brook on 2016/5/14.
 */
console.log('弹幕可以有');
const MESSAGE_TAG = 'page';

chrome.runtime.sendMessage({
    tag: MESSAGE_TAG
});