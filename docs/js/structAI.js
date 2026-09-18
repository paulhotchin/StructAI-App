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
