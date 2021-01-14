var htmlPlayground = null;
var htmlViewer = document.getElementById('html-viewer');
var htmlViewerShadow = htmlViewer.attachShadow({
    mode: 'open'
});

Reveal.addKeyBinding(69, switchPlayground);
Reveal.registerKeyboardShortcut('E', 'Show/Hide playground');


var playgroundHeader = document.querySelector('#html-playground > .header');
var playground = document.querySelector('#html-playground');

function switchPlayground() {
    var open = playground.dataset.open;
    if (open === 'true') {
        playground.dataset.open = 'false';
        playground.style.height = '0';

        window.onbeforeunload = null;
        window.onkeydown = null;
    } else {
        playground.dataset.open = 'true';
        playground.style.height = '100vh';

        window.onbeforeunload = function (e) {
            return true;
        }

        window.onkeydown = function (e) {
            if (e.keyCode === 27) {
                e.preventDefault();
                Reveal.toggleOverview(false);
                switchPlayground();
            }
        }
    }
}
playgroundHeader.addEventListener('mousedown', switchPlayground);