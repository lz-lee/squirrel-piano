(function (doc, win){
    var docEl = doc.documentElement;
    var resizeEvt = 'orientationonchange' in window ? 'orientationonchange' : 'resize';
    var recalc = function() {
        var clientwidth = docEl.clientWidth;
        if (!clientwidth) {
            return;
        } 
        docEl.style.fontSize =  clientwidth / 7.5 + 'px';
    };
    if (!doc.addEventListener) {
        return;
    }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window)