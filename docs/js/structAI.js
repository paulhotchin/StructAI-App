window.structAI = window.structAI || {};

window.structAI.save = function (key, json) {
    localStorage.setItem(key, json);
};

window.structAI.load = function (key) {
    return localStorage.getItem(key);
};

window.structAI.selectOnCoarsePointer = function () {
    if (!window.matchMedia("(pointer: coarse)").matches) {
        return;
    }

    setTimeout(() => {
        const input = document.activeElement;

        if (input instanceof HTMLInputElement) {
            input.select();
        }
    }, 0);
};

// Windows-style hotkeys: Alt+S / Alt+N / Alt+B click the button marked data-hotkey="s|n|b"
// (Save / Next / Back). Disabled buttons are ignored. The focused input is blurred first so a
// number that was just typed is committed to the model before the button runs.
window.structAI.hotkeys = {
    "KeyS": "s",
    "KeyN": "n",
    "KeyB": "b"
};

document.addEventListener("keydown", function (e) {
    if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) {
        return;
    }

    const key = window.structAI.hotkeys[e.code];
    if (!key) {
        return;
    }

    const button = document.querySelector('button[data-hotkey="' + key + '"]');
    if (!button || button.disabled) {
        return;
    }

    e.preventDefault();

    if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
    }

    setTimeout(function () { button.click(); }, 30);
});
