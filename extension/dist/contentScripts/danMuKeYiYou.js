'use strict';

/**
 * Created by Brook on 2016/5/14.
 */
console.log('弹幕可以有');
var MESSAGE_TAG = 'page';

chrome.runtime.sendMessage({
  tag: MESSAGE_TAG
});