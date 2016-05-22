/**
 * Created by Brook on 2016/5/21.
 */
self.port.on('options', console.log);
self.port.emit('getOptions');
