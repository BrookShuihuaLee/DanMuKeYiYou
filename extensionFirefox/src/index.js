import self from 'sdk/self';
import pageMod from 'sdk/page-mod';
import POPUP_HANDLER from './PopupHandler.js'
//import IO from './lib/socket.io.js';




pageMod.PageMod({
    include: '*',//['http://*', 'https://*'],
    contentScriptFile: [self.data.url('./contentScripts/danMuKeYiYou.js')],
    contentStyleFile: [self.data.url('./contentScripts/danMuKeYiYou.css')],
    onAttach: worker => {
        worker.port.on('loaded', d => {
            console.log(d);
            worker.port.emit('xxx', 23);
        });
    }
});