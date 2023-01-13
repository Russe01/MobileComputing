

window.onload = () => {

    let buttonDiv = $("#buttonDiv");
    buttonDiv.css("position", "sticky");
    buttonDiv.css("top", "10px");

    if (window.matchMedia("only screen and (max-width: 768px)").matches) {
        let centerDiv = $(".col-sm-6");
        let buttonDiv = $("#buttonDiv");
        let centerDivCopy = centerDiv.clone();
        let buttonDivCopy = buttonDiv.clone();
        centerDiv.replaceWith(buttonDivCopy);
        buttonDiv.replaceWith(centerDivCopy);
        $(".col-sm-6").attr("class", "");
        $(".col-sm-3").attr("class", "");
        $(".row").attr("class", "container-fluid");

        $("h4").remove();
        let buttonUp = document.createElement("button");
        buttonUp.class = "btn btn-primary";
        buttonUp.textContent = "Up";
        buttonUp.onclick = () => moveVideoImageBox("w");

        let buttonRight = document.createElement("button");
        buttonRight.class = "btn btn-primary";
        buttonRight.textContent = "Right";
        buttonRight.onclick = () => moveVideoImageBox("d");
        
        let buttonDown = document.createElement("button");
        buttonDown.class = "btn btn-primary";
        buttonDown.textContent = "Down";
        buttonDown.onclick = () => moveVideoImageBox("s");

        let buttonLeft = document.createElement("button");
        buttonLeft.class = "btn btn-primary";
        buttonLeft.textContent = "Left";
        buttonLeft.onclick = () => moveVideoImageBox("a");

        let moveDiv = document.getElementById("moveDiv");
        moveDiv.appendChild(buttonUp);
        moveDiv.appendChild(buttonDown);
        moveDiv.appendChild(buttonLeft);
        moveDiv.appendChild(buttonRight);
    }

    var video = document.getElementById("video");

    navigator.mediaDevices.getUserMedia({ video: {
        facingMode: 'user'
        } })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (error) {
             alert("An Error occured while loading the video stream.");
        });


    document.querySelector('input[type="file"]').addEventListener("change", function() {
        if (this.files && this.files[0]) {
            let img = document.getElementById("image" + ($(".imageContainer").length - 1));
            img.src = URL.createObjectURL(this.files[0]);
        }
    });
    document.getElementById("video").onplay = () => resizeVideoContainer();

    addNewImageContainer();
}


window.onresize = () => {
    resizeAllImages();
    resizeVideoContainer();
}

function resizeVideoContainer() {
    if ($(".videoDataContainer").position().left < ($(".col-sm-6").width() - $(".videoDataContainer").position().left - $(".videoDataContainer").width() + 2 * parseInt($(".col-sm-6").css("padding-right")))) {
        $(".videoDataContainer").css("width", "95%");
    }
    if ($(".videoDataContainer").width() - $("#video").width() <= 20) {
        $(".videoDataContainer").css("width", ($("#video").width() + 20) + "px");
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    event.dataTransfer.clearData();
    event.dataTransfer.setData("text", event.target.id);
}

function dragDrop_videoContainer(event) {
    if (event.target.children.length == 0 && event.target.className == "videoContainer") {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        event.target.appendChild(document.getElementById(data));
    }
    
}

function dragDrop_imageContainer(event) {
    if (event.target.children.length == 0 && event.target.className == "imageContainer") {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var image = document.getElementById(data);
        event.target.appendChild(document.getElementById(data));
        resizeSingleImage("#" + event.target.id);
    }
    
}



function downsizeVideoImage() {
    if ($("#videoContainer").children().length == 0) {
        alert("You have to put an image over the video.");
        return;
    } else {
        var image_height = $("#videoContainer").children().height();
        var image_width = $("#videoContainer").children().width();
        if (image_height < image_width) {
            if (image_height - 10 <= 0) {
                return;
            }
            let heightRatio = 10 / image_height;
            $("#videoContainer").children().width(image_width - (heightRatio * image_width));
            $("#videoContainer").children().height(image_height - 10);
            
        } else {
            if (image_width - 10 <= 0) {
                return;
            }
            let widthRatio = 10 / image_width;
            $("#videoContainer").children().width(image_width - 10);
            $("#videoContainer").children().height(image_height - (widthRatio * image_height));
        }
    }
}

function upsizeVideoImage() {
    if ($("#videoContainer").children().length == 0) {
        alert("You have to put an image over the video.");
        return;
    } else {
        let image_height = $("#videoContainer").children().height();
        let image_width = $("#videoContainer").children().width();
        let container_height = $("#videoContainer").height();
        let container_width = $("#videoContainer").width();
        if (image_height < image_width) {
            if (image_width + 10 > container_width) {
                return;
            }
            let widthRatio = 10 / image_width;
            $("#videoContainer").children().width(image_width + 10);
            $("#videoContainer").children().height(image_height + (widthRatio * image_height));
            
        } else {
            if (image_height + 10 > container_height) {
                return;
            }
            let heightRatio = 10 / image_height;
            $("#videoContainer").children().width(image_width + (heightRatio * image_width));
            $("#videoContainer").children().height(image_height + 10);
        }

    }
}



function addNewImageContainer() {
    if ($(".imageContainer").last().children().attr("src") == "") {
        return;
    }
    let numberOfImageContainer = $(".imageContainer").length;
    let newContainer = document.createElement("div");
    newContainer.id = "imageContainer" + numberOfImageContainer;
    newContainer.className = "imageContainer";
    newContainer.ondrop = (event) => dragDrop_imageContainer(event);
    newContainer.ondragover = (event) => allowDrop(event);

    let image = document.createElement("img");
    image.id = "image" + numberOfImageContainer;
    image.class = "image";
    image.draggable = "true";
    image.src = "";
    image.ondragstart = (event) => dragStart(event);
    image.onload = (event) => resizeSingleImage("#" + event.target.parentNode.id);
    newContainer.appendChild(image);

    let imageContainerParent = document.getElementById("imageContainerHeap");
    imageContainerParent.insertBefore(newContainer, imageContainerParent.children[imageContainerParent.children.length - 2]);
}

function resizeSingleImage(imageContainer_jquery_ID) {
    
    let imageWidth = $(imageContainer_jquery_ID).children().width();
    let imageHeight = $(imageContainer_jquery_ID).children().height();

    let container_image_width_difference = $(imageContainer_jquery_ID).width() - imageWidth;
    let container_image_height_difference = $(imageContainer_jquery_ID).height() - imageHeight;

    if (container_image_width_difference < container_image_height_difference) {
        let widthRatio = (container_image_width_difference - 10) / imageWidth;
        $(imageContainer_jquery_ID).children().width(imageWidth + (container_image_width_difference - 10));
        $(imageContainer_jquery_ID).children().height(imageHeight + (widthRatio * imageHeight));
    } else {
        let heightRatio = (container_image_height_difference - 10) / imageHeight;
        $(imageContainer_jquery_ID).children().width(imageWidth + (heightRatio * imageWidth));
        $(imageContainer_jquery_ID).children().height(imageHeight + (container_image_height_difference - 10));
    }

}


function resizeAllImages() {
    $(".imageContainer").each(function(index, element) {
        resizeSingleImage(element);
    });
}

function centerVideoImageBox() {
    $("#videoContainer").css("top", "25%");
    $("#videoContainer").css("left", "25%");
}

function moveVideoImageBox(key) {
    let leftPercentage = parseInt($("#videoContainer").css("left")) / parseInt($("#videoDiv").width()) * 100;
    let topPercentage = parseInt($("#videoContainer").css("top")) / parseInt($("#videoDiv").height()) * 100;
    if (key == "w") {
        if (topPercentage - 1 < 0) {
            return;
        }
        $("#videoContainer").css("top", (topPercentage - 1) + "%");
    }
    if (key == "d") {
        if (leftPercentage + 1 > 50) {
            return;
        }
        $("#videoContainer").css("left", (leftPercentage + 1) + "%");
    }
    if (key == "s") {
        if (topPercentage + 1 > 50) {
            return;
        }
        $("#videoContainer").css("top", (topPercentage + 1) + "%");
    }
    if (key == "a") {
        if (leftPercentage - 1 < 0) {
            return;
        }
        $("#videoContainer").css("left", (leftPercentage - 1) + "%");
    }
}

function screenShot() {
    var canvas = document.getElementById("canvas");
    var video = document.getElementById("video");
    if (video.paused) {
        alert("You have to give the permission to use the camera, if it exists.");
        return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    ctx.restore();
    var image = document.getElementById("videoContainer").children[0];
    if (image == undefined) {
        return;
    }
    var xPosition = $("#videoContainer").position().left - $("video").position().left + $("#videoContainer").children().position().left;
    var yPosition = $("#videoContainer").position().top - $("video").position().top + $("#videoContainer").children().position().top;
    ctx.drawImage(image, xPosition, yPosition, $("#videoContainer").children().width(), $("#videoContainer").children().height());
              
}

function download() {
    let downloadLink = document.createElement("a");
    let canvas = document.getElementById("canvas");
    let blankCanvas = document.createElement("canvas");
    if (blankCanvas.toDataURL() === canvas.toDataURL()) {
        alert("You have to take a screenshot first.");
        return;
    }
    downloadLink.href = canvas.toDataURL();
    downloadLink.download = 'myImage.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}




