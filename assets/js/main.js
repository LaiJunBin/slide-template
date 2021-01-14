var runJSButton = document.getElementById('run-js-btn');
var runPHPButton = document.getElementById('run-php-btn');
var contextMenu = document.getElementById('context-menu');
var loading = document.getElementById('loading');
var code = '';
// More info about initialization & config:
// - https://revealjs.com/initialization/
// - https://revealjs.com/config/
Reveal.initialize({
    hash: true,
    slideNumber: true,

    // Learn about plugins: https://revealjs.com/plugins/
    plugins: [RevealMarkdown, RevealHighlight, RevealNotes]
}).then(event => {
    Reveal.getRevealElement().querySelectorAll('img').forEach(img => img.draggable = false);

    Promise.all([...Reveal.getRevealElement().querySelectorAll('[data-column-count]')].map(el => {
        return new Promise(resolve => {
            let count = el.dataset.columnCount;
            el.style.columnCount = count;
            el.style.columnRule = '1px solid #ddd';

            el.children.forEach(child => {
                let div = document.createElement('div');
                div.classList.add('column');
                div.innerHTML = child.outerHTML;
                child.replaceWith(div);
            });

            let images = [...el.querySelectorAll('img')];
            Promise.all(images.map(img => new Promise(resolve => img.onload = resolve)))
                .then(() => {
                    el.children.forEach(child =>
                        child.style.minHeight = el.clientHeight + 'px');
                    resolve();
                });

            delete el.dataset.columnCount;
        });
    })).then(() => {
        let slide = event.currentSlide;

        slide.scrollTop = 0;
        if (slide.clientHeight > slide.parentNode.clientHeight) {
            slide.style.height = slide.parentNode.clientHeight + 'px';
            slide.style.overflowY = 'scroll';
        }

        let height = slide.offsetHeight;
        let top = (Reveal.getComputedSlideSize().height - height) / 2;
        slide.style.top = top + 'px';

        Reveal.on('slidechanged', event => {
            let slide = event.currentSlide;
            slide.scrollTop = 0;
            if (slide.clientHeight > slide.parentNode.clientHeight) {
                slide.style.height = slide.parentNode.clientHeight + 'px';
                slide.style.overflowY = 'scroll';
            }
        });


        Reveal.getRevealElement().querySelectorAll('code').forEach(el => {
            el.addEventListener('contextmenu', e => {
                if (getSelection().isCollapsed) {
                    e.preventDefault();
                    let el = e.target;
                    while (el !== null && el.tagName !== 'CODE') {
                        el = el.parentNode;
                    }
                    if (!el) {
                        return;
                    }
                    code = el.innerText;
                    contextMenu.style.left = e.clientX + 'px';
                    contextMenu.style.top = e.clientY + 'px';
                    contextMenu.style.display = 'block';
                }
            })
        })

    });

});

runJSButton.addEventListener('click', () => {
    try {
        console.logs = [];
        eval(code);
        let output = console.logs.join('\n') || '無輸出';
        Swal.fire({
            icon: 'success',
            title: '執行成功',
            html: `<pre style="text-align: left;">執行結果：\n${output}</pre>`
            // showConfirmButton: false,
            // timer: 1000
        });
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: '無法執行程式'
        });
        console.log('無法執行', e);
    }
    contextMenu.style.display = 'none';
    code = '';
});

runPHPButton.addEventListener('click', () => {
    loading.style.display = 'flex';
    fetch('http://localhost/eval-api/', {
            method: 'POST',
            body: btoa(unescape(encodeURIComponent(code)))
        }).then(res => res.json())
        .then(res => {
            loading.style.display = 'none';
            if (res.success) {
                let output = res.data || '無輸出';
                Swal.fire({
                    icon: 'success',
                    title: '執行成功',
                    html: `<pre style="text-align: left;">執行結果：\n${output}</pre>`
                    // showConfirmButton: false,
                    // timer: 1000
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '無法執行程式',
                    text: res.data
                });
                console.log(res.data);
            }
        }).catch(err => {
            loading.style.display = 'none';
            Swal.fire({
                icon: 'error',
                title: '無法執行程式',
                text: '沒有PHP執行環境'
            });
        });
    contextMenu.style.display = 'none';
    code = '';
});

let dragging = false;
document.body.addEventListener('mousedown', e => {
    dragging = true;
    if (!contextMenu.children.namedItem(e.target.id))
        contextMenu.style.display = 'none';
});

window.addEventListener('mousemove', e => {
    if (Reveal.getState().overview && dragging) {
        let transform = getComputedStyle(Reveal.getSlidesElement()).transform;
        let match = transform.match(/^matrix\((.+)\)$/);
        let values = match[1].split(', ');
        let x = parseInt(values[4]);
        let y = parseInt(values[5]);
        x += e.movementX * 1.33;
        y += e.movementY * 1.33;

        Reveal.getSlidesElement().style.transform =
            `matrix(${values[0]}, ${values[1]}, ${values[2]}, ${values[3]}, ${x}, ${y})`;
    }
});

window.addEventListener('mouseup', () => {
    dragging = false;
});

Reveal.on('overviewshown', () => Reveal.getSlides().forEach(el => el.classList.add('slide-outline')));
Reveal.on('overviewhidden', () => Reveal.getSlides().forEach(el => el.classList.remove('slide-outline')));