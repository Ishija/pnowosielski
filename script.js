let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

document.getElementById("saveButton").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
        let rasterMapContainer = document.getElementById("rasterMapContainer");
        rasterMapContainer.innerHTML = '';
        let element = Array();
        let p_id = 0;
        let width = 200;
        let height = 100;
        for (let i=0;i<4;i++){
            for (let j=0;j<4;j++){
                let map_tile=document.createElement('canvas');
                let ctx_tile = map_tile.getContext("2d");
                map_tile.style.width=width+"px";
                map_tile.style.height=height+"px";
                map_tile.draggable = true;
                map_tile.className="puzzle";
                map_tile.id="puzzle"+p_id;
                ctx_tile.drawImage(canvas,j*width,i*height,width,height,0,0,map_tile.width,map_tile.height)
                map_tile.toDataURL();
                element.push(map_tile)
                p_id++;
            }
        }
        shuffleTiles(element);
        for (let i=0;i<16;i++){
            rasterMapContainer.appendChild(element[i]);
        }
        drag_handler();
    });
});
function shuffleTiles(container) {
     if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            const notification = new Notification("Let's play :)!");
        }
    });
}
    for (var i = container.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [container[i], container[j]] = [container[j], container[i]];
    }
    return container;
}

function drag_handler() {
    let items = document.querySelectorAll('.puzzle');
    for (let item of items) {
        item.addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("text", this.id);
        });
    }
    let targets = document.querySelectorAll(".tile");
    for (let target of targets) {
        target.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        target.addEventListener("drop", function (event) {
            let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
            this.appendChild(myElement);
            puzzle_completed();
        }, false);
    }
}
function puzzle_completed() {
    let targets = document.querySelectorAll(".tile .puzzle");

    if (targets.length === 16 && Array.from(targets).every((target, index) => target.id === `puzzle${index}`)) {
        console.log("Puzzle Completed");
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Congrats!");
        }
    }
}

document.getElementById("getLocation").addEventListener("click", function (event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});


