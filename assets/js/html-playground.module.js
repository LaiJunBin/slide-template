require.config({
    paths: {
        'vs': 'vendor/monaco-editor/dev/vs'
    }
});
require(['vs/editor/editor.main'], function () {

    htmlPlayground = monaco.editor.create(document.querySelector('#html-playground .editor'), {
        value: '',
        language: 'html',
        theme: "vs-dark",
        fontSize: 20,
        automaticLayout: true
    });

    htmlPlayground.addAction({
        id: "run",
        label: "Run",
        keybindings: [monaco.KeyCode.F5],
        contextMenuGroupId: "navigation",
        run: editor => {
            Swal.fire({
                icon: 'success',
                // title: '執行成功',
                showConfirmButton: false,
                timer: 100
            });
            htmlViewerShadow.innerHTML = editor.getValue();
        }
    });

    htmlPlayground.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
        htmlPlayground.getAction('editor.action.formatDocument').run();
        htmlPlayground.getAction('run').run();
    });

    window['emmet-monaco'].enableEmmet(htmlPlayground, window.emmet);
    playground.style.height = '0';
    playground.style.visibility = 'visible';
    setTimeout(() => playground.style.transition = 'height .5s', 100)
});