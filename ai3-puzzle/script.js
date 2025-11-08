var map = L.map('map').setView([51.0, 19.0], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);


var myMarker = null;


//lokalizacja
document.getElementById('button-localization').addEventListener('click', function () {
    if (!navigator.geolocation) {
        alert('Brak geolokalizacji w przeglądarce');
        return;
    }
    navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        if (myMarker) map.removeLayer(myMarker);
        myMarker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 14);
    }, function (err) {
        alert('Błąd geolokalizacji: ' + err.message);
    });
});

//powiadomienie
var notificationButton = document.getElementById('button-notification-perm');
notificationButton.addEventListener('click', function () {
    if (!('Notification' in window)) {
        alert('Przeglądarka nie wspiera Notification API');
        return;
    }
    Notification.requestPermission().then(function (permission) {
        alert('Status: ' + permission);
    });
});


var desk = document.getElementById('puzzle-desk');
var board = document.getElementById('puzzle-board');
var pieces = [];
var placedCount = 0;


function clearPuzzleAreas() {
    desk.innerHTML = '';
    board.innerHTML = '';
    pieces = [];
    placedCount = 0;
}

function makeSlots(cols, rows, pw, ph) {
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var slot = document.createElement('div');
            slot.className = 'slot';
            slot.style.left = (c * pw) + 'px';
            slot.style.top = (r * ph) + 'px';
            slot.dataset.col = c;
            slot.dataset.row = r;
            board.appendChild(slot);
            slot.addEventListener('dragover', function (e) { e.preventDefault(); });
            slot.addEventListener('drop', slotDrop);
        }
    }
}

function slotDrop(e) {
    e.preventDefault();
    var id = e.dataTransfer.getData('text/plain');
    var piece = document.getElementById(id);
    if (!piece) return;
    var slot = this;
    piece.style.left = slot.style.left;
    piece.style.top = slot.style.top;
    board.appendChild(piece);
    var targetCol = slot.dataset.col | 0;
    var targetRow = slot.dataset.row | 0;
    var pcol = piece.dataset.col | 0;
    var prow = piece.dataset.row | 0;
    if (pcol === targetCol && prow === targetRow) {
        piece.style.border = '2px solid green';
        console.log('Kawałek w dobrym miejscu')
    } else {
        piece.style.border = '2px solid red';
        console.log('Kawałek w złym miejscu')
    }
    checkWin();
}

function checkWin() {
    var cols = 4, rows = 4;
    if (document.querySelectorAll('.piece[style*="green"]').length === cols * rows) {
        console.log('Wszystkie kawałi w dobrym miejscu.')
        if (Notification.permission === 'granted') {
            new Notification('Puzzle ułożone', { body: 'Gratulacje. Wszystkie elementy są na miejscu.' });
        } else {
            alert('Ułożono puzzle, ale brak zgody na powiadomienia.');
        }
    }
}


function makePieceImage(cnv, sx, sy, w, h, id, col, row) {
    var img = document.createElement('img');
    img.className = 'piece';
    img.id = id;
    img.dataset.col = col;
    img.dataset.row = row;
    img.draggable = true;
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    ctx.drawImage(cnv, sx, sy, w, h, 0, 0, w, h);
    img.src = c.toDataURL();
    img.style.width = w + 'px';
    img.style.height = h + 'px';
    img.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', this.id);
    });
    return img;
}

function shuffleArray(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
}


document.getElementById('button-download').addEventListener('click', function () {
    html2canvas(document.getElementById('map'), { useCORS: true, logging: false }).then(function (canvas) {
        clearPuzzleAreas();
        var cols = 4, rows = 4;
        var pw = Math.floor(canvas.width / cols);
        var ph = Math.floor(canvas.height / rows);

        board.style.width = (cols * 150) + 'px';
        board.style.height = (rows * 150) + 'px';
        var scaleX = (cols * 150) / canvas.width;
        var scaleY = (rows * 150) / canvas.height;
        makeSlots(cols, rows, 150, 150);

        var arr = [];
        var idCounter = 0;
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var sx = c * pw;
                var sy = r * ph;
                var id = 'piece-' + idCounter++;
                var img = makePieceImage(canvas, sx, sy, pw, ph, id, c, r);
                img.style.width = '150px';
                img.style.height = '150px';
                img.style.position = 'absolute';
                img.style.left = (10 + Math.random() * 450) + 'px';
                img.style.top = (10 + Math.random() * 300) + 'px';
                desk.appendChild(img);
                arr.push(img);
            }
        }
        shuffleArray(arr);
        for (var i = 0; i < arr.length; i++) {
            var p = arr[i];
            p.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', this.id); });
            pieces.push(p);
        }

        desk.addEventListener('dragover', function (e) { e.preventDefault(); });
        desk.addEventListener('drop', function (e) {
            e.preventDefault();
            var id = e.dataTransfer.getData('text/plain');
            var el = document.getElementById(id);
            if (!el) return;
            var rect = desk.getBoundingClientRect();
            el.style.left = (e.clientX - rect.left - 75) + 'px';
            el.style.top = (e.clientY - rect.top - 75) + 'px';
            desk.appendChild(el);
        });


    }).catch(function (err) {
        alert('Błąd przy renderowaniu mapy: ' + err);
    });
});

board.style.width = '600px';
board.style.height = '600px';
makeSlots(4,4,150,150);