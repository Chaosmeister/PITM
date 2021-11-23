KB.on('dom.ready', function () {
    function makepath(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    const path = makepath(10);

    function onPaste(e) {
        var activeElement = document.activeElement;
        if (activeElement) {
            var inputs = ['textarea'];
            if (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1) {

                function IntoTextArea(data) {
                    activeElement.value += data;
                }

                function onFileLoaded(e) {
                    const urlParams = new URLSearchParams(window.location.search);

                    var link = '?controller=PasteController&action=upload&plugin=PITM';
                    KB.http.postJson(link, {
                        'data': e.target.result,
                        'task_id': urlParams.get('task_id'),
                        'path': path
                    }).success(IntoTextArea);
                }

                if (e.clipboardData && e.clipboardData.items) {
                    var items = e.clipboardData.items;
                    if (items) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].type.indexOf("image") !== -1) {
                                var blob = items[i].getAsFile();
                                var reader = new FileReader();
                                reader.onload = onFileLoaded;
                                reader.readAsDataURL(blob);
                            }
                        }
                    }
                } else {
                    setTimeout(checkInput, 100);
                }
            }
        }
    }

    function Enlarge(e) {

        const winHtml =
            '<html>' +
            '<head>' +
            '<meta name="viewport" content="width=device-width, minimum-scale=0.1">' +
            '<title>Image</title>' +
            '<style>* { margin: 0;padding: 0; } .imgbox { background-color: 000; display: grid; height: 100%; } .center-fit { max-width: 500%; max-height: 500vh; margin: auto; }</style>' +
            '</head>' +
            '<body>' +
            '<div class="imgbox">' +
            '<img class="center-fit" src="' + e.target.src + '"/>' +
            '</div>' +
            '</body>' +
            '</html>';

        const winUrl = URL.createObjectURL(
            new Blob([winHtml], { type: "text/html" })
        );

        window.open(winUrl);
    }

    KB.onClick('.enlargable', Enlarge, !0);
    window.addEventListener('paste', onPaste, !1);
});