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
                    var position = activeElement.selectionStart;
                    var value = activeElement.value;
                    
                    activeElement.value = value.slice(0, position) + data + value.slice(position);
                }

                function onFileLoaded(e) {
                    var link = '?controller=PasteController&action=upload&plugin=PITM';

                    var json = {
                        'data': e.target.result,
                        'path': path
                    };

                    var TaskId =  getTaskId();

                    if (TaskId)
                    {
                        json['task_id'] = TaskId
                    }

                    KB.http.postJson(link, json).success(IntoTextArea);
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

    function getTaskId(){
        var urlParamId = new URLSearchParams(window.location.search).get('task_id');
        if (urlParamId){
            return urlParamId;
        }

        var urlHrefId = window.location.href.replace(/.*\/task\/(\d+)\/*\?*.*/ig, "$1");
        if (urlHrefId != window.location.href){
            return urlHrefId;
        }

        var urlPostId;
        var forms = document.getElementsByTagName("form");
        for (var i = 0; i < forms.length; i++){
            if (forms[i].getAttribute("method").toLowerCase() == "post" && 
                forms[i].getAttribute("action").toLowerCase().indexOf("task_id=") >= 0){
                    urlPostId = forms[i].getAttribute("action").replace(/.*task_id=(\d+).*/ig, "$1");
                    break;
            }
        }
        if (urlPostId){
            return urlPostId;
        }
    }

    function Enlarge(e) {
        window.open(e.target.src);
    }

    KB.onClick('.enlargable', Enlarge, !0);
    window.addEventListener('paste', onPaste, !1);
});
