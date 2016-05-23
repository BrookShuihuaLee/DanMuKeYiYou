/**
 * Created by Brook on 2016/5/21.
 */
document.getElementById('about').addEventListener('click', () => {
    self.port.emit('openAbout');
});

const
    DEBUG = false,
    DEBUG_LOG = (...args) => {
        if (DEBUG) console.log(...args);
    };

let color = '#000';
let fontSize = '48';
let direction = 'right';
let enable = true;

let scale = '1';
let family = '';
let alpha = '1';
let time = '1';

let show = 'send';

function saveOptions() {
    self.port.emit('setOptions', {
        color,
        fontSize,
        direction,
        enable
    });
    renderOptions();
}

let remainText = 15;
function setTextNum(n) {
    n = n || remainText;
    let current = document.getElementById('content').value.trim().length;
    n -= current;
    document.getElementById('content-length').innerText = n;
    if (n < 0) {
        document.getElementById('content').style.color = 'red';
    } else {
        document.getElementById('content').style.color = '#000';
    }
}

document.getElementById('show-toggle').addEventListener('click', e => {
    if (show === 'send') {
        show = 'display';
        document.getElementById('show-toggle').innerText = '返回';
        document.getElementById('send-settings').style.display = 'none';
        document.getElementById('display-settings').style.display = 'block';
    } else {
        show = 'send';
        document.getElementById('show-toggle').innerText = '弹幕显示设置';
        document.getElementById('display-settings').style.display = 'none';
        document.getElementById('send-settings').style.display = 'block';
    }
});

document.getElementById('size').addEventListener('click', e => {
    if (e.target === document.getElementById('size')) {
        return;
    }
    let t = e.target;
    fontSize = t.attributes.value.value;
    saveOptions();
});

document.getElementById('direction').addEventListener('click', e => {
    if (e.target === document.getElementById('direction')) {
        return;
    }
    let t = e.target;
    direction = t.attributes.value.value;
    saveOptions();
});

document.getElementById('colors').addEventListener('click', e => {
    if (e.target === document.getElementById('colors')) {
        return;
    }
    let t = e.target;
    if (t.nodeName === 'DIV') {
        t = t.children[0];
    }
    color = t.style.backgroundColor;
    saveOptions();
});

document.getElementById('d-scale').addEventListener('click', e => {
    if (e.target === document.getElementById('d-scale')) {
        return;
    }
    let t = e.target;
    scale = t.attributes.value.value;
    saveDisplayOption();
});

document.getElementById('d-time').addEventListener('click', e => {
    if (e.target === document.getElementById('d-time')) {
        return;
    }
    let t = e.target;
    time = t.attributes.value.value;
    saveDisplayOption();
});

document.getElementById('d-family').addEventListener('click', e => {
    if (e.target === document.getElementById('d-family')) {
        return;
    }
    let t = e.target;
    family = t.attributes.value.value;
    saveDisplayOption();
});

document.getElementById('d-alpha').addEventListener('click', e => {
    if (e.target === document.getElementById('d-alpha')) {
        return;
    }
    let t = e.target;
    if (t.nodeName === 'DIV') {
        t = t.children[0];
    }
    alpha = t.style.opacity;
    saveDisplayOption();
});

function saveDisplayOption() {
    self.port.emit('setDisplay', {
        scale,
        family,
        alpha,
        time
    });
    renderDisplayOption();
}

function renderDisplayOption() {
    DEBUG_LOG({time, scale, family, alpha});
    [...document.getElementById('d-time').children].forEach(e => {
        if (e.attributes.value.value === time) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });
    
    [...document.getElementById('d-scale').children].forEach(e => {
        if (e.attributes.value.value === scale) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });
    
    [...document.getElementById('d-family').children].forEach(e => {
        if (e.attributes.value.value === family) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });
    
    [...document.getElementById('d-alpha').children].forEach(e => {
        if (e.children[0].style.opacity === alpha) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });
}

function sendMessage() {
    enable = true;
    saveOptions();
    let text = document.getElementById('content').value.trim();
    text = text.replace('\n', '');
    if (text && text.length <= remainText) {
        document.getElementById('content').value = '';
        self.port.emit('sendMessage', {
            text,
            direction,
            color,
            fontSize
        });
        setTextNum();
    }
}

document.getElementById('content').addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        sendMessage();
    } else {
        setTextNum();
    }
});

document.getElementById('btn').addEventListener('click', e => {
    sendMessage();
});

document.getElementById('enable-toggle').addEventListener('click', e => {
    enable = !enable;
    saveOptions();
});

function renderOptions() {
    [...document.getElementById('size').children].forEach(e => {
        DEBUG_LOG(e.attributes.value.value, 'color', fontSize);
        if (e.attributes.value.value === fontSize) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });

    [...document.getElementById('direction').children].forEach(e => {
        if (e.attributes.value.value === direction) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });

    [...document.getElementById('colors').children].forEach(e => {
        DEBUG_LOG(e.children[0].style.backgroundColor, 'color', color);
        if (e.children[0].style.backgroundColor === color) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });

    document.getElementById('enable-toggle').innerText = enable ? '关' : '开';

    switch (fontSize) {
        case '48':
            setTextNum(20);
            remainText = 20;
            break;
        case '60':
            setTextNum(15);
            remainText = 15;
            break;
        case '72':
            setTextNum(10);
            remainText = 10;
            break;
        default:
            setTextNum(15);
            remainText = 15;
    }
}

self.port.on('options', options => {
    ({enable, color, fontSize, direction} = options);
    renderOptions();
});

self.port.on('display', options => {
    ({scale, family, alpha, time} = options);
    renderOptions();
});

window.setTimeout(() => {
    self.port.emit('getOptions');
    self.port.emit('getDisplay');
}, 1000);