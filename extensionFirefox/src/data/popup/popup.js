/**
 * Created by Brook on 2016/5/21.
 */
document.body.innerHTML = 'hfffhh';
document.body.addEventListener('click', () => {
    document.body.innerHTML = document.body.innerHTML + '3';
});
self.port.on('options', console.log);
self.port.emit('getOptions');
