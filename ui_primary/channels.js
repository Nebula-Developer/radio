var musicChannelElm = document.getElementById("music-channel");
var mic1ChannelElm = document.getElementById("mic1-channel");
var mic2ChannelElm = document.getElementById("mic2-channel");

var musicChannelVolumeFill = musicChannelElm.querySelector(".channel-volume-fill");
var mic1ChannelVolumeFill = mic1ChannelElm.querySelector(".channel-volume-fill");
var mic2ChannelVolumeFill = mic2ChannelElm.querySelector(".channel-volume-fill");

var musicChannelVolumeGrabber = musicChannelElm.querySelector(".channel-volume-grabber");
var mic1ChannelVolumeGrabber = mic1ChannelElm.querySelector(".channel-volume-grabber");
var mic2ChannelVolumeGrabber = mic2ChannelElm.querySelector(".channel-volume-grabber");

var musicChannel = {
    elm: musicChannelElm,
    volumeFill: musicChannelVolumeFill,
    volumeGrabber: musicChannelVolumeGrabber,
    volume: 0
}

var mic1Channel = {
    elm: mic1ChannelElm,
    volumeFill: mic1ChannelVolumeFill,
    volumeGrabber: mic1ChannelVolumeGrabber,
    volume: 0
}

var mic2Channel = {
    elm: mic2ChannelElm,
    volumeFill: mic2ChannelVolumeFill,
    volumeGrabber: mic2ChannelVolumeGrabber,
    volume: 0,
    output: 0
}

function setChannelVolume(channel, volume) {
    channel.volume = volume;
    channel.volumeGrabber.style.bottom = "calc(" + volume + "% + 0.5px)";
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function updateChannelVolumeFill(channel, volume) {
    var channelVolume = channel.volume;
    var newVolume = volume * (channelVolume / 100);
    channel.output = newVolume;
    channel.volumeFill.style.height = newVolume + "%";
}

document.onmousedown = (e) => {
    console.log(e.y);
}

function addGrabberListener(channel) {
    channel.volumeGrabber.addEventListener('mousedown', (e) => {
        var volumeParent = channel.volumeGrabber.parentNode;
        var topOfParent = volumeParent.getBoundingClientRect().top;
        var bottomOfParent = volumeParent.getBoundingClientRect().bottom;
        
        var mouseMoveListener = (e) => {
            var mouseY = e.clientY;
            var newVolume = 100 - ((mouseY - topOfParent) / (bottomOfParent - topOfParent)) * 100;
            newVolume = Math.max(0, Math.min(100, newVolume));
            setChannelVolume(channel, newVolume);
            console.log(newVolume);
        }

        var mouseUpListener = (e) => {
            document.removeEventListener('mousemove', mouseMoveListener);
            document.removeEventListener('mouseup', mouseUpListener);
        }

        document.addEventListener('mousemove', mouseMoveListener);
        document.addEventListener('mouseup', mouseUpListener);
    });
}

addGrabberListener(musicChannel);
addGrabberListener(mic1Channel);
addGrabberListener(mic2Channel);

setChannelVolume(musicChannel, 50);

var t = 0;
setInterval(() => {
    t++;
    updateChannelVolumeFill(musicChannel, Math.sin(t / 10) * 50 + 50);
    updateChannelVolumeFill(mic1Channel, Math.sin(t / 20) * 50 + 50);
    updateChannelVolumeFill(mic2Channel, Math.sin(t / 30) * 50 + 50);
}, 1000 / 60);

