function makeChannel(channelName) {
    var elm = document.querySelector(`#${channelName}-channel`);
    var channel = {
        elm,
        volumeFill: elm.querySelector(".channel-volume-fill"),
        volumeGrabber: elm.querySelector(".channel-volume-grabber"),
        volume: 0,
        output: 0
    }

    setChannelVolume(channel, 75);
    return channel;
}

var musicChannel = makeChannel("music");
var mic1Channel = makeChannel("mic1");
var mic2Channel = makeChannel("mic2");

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

var t = 0;
setInterval(() => {
    t++;
    updateChannelVolumeFill(musicChannel, Math.sin(t / 10) * 50 + 50);
    updateChannelVolumeFill(mic1Channel, Math.sin(t / 20) * 50 + 50);
    updateChannelVolumeFill(mic2Channel, Math.sin(t / 30) * 50 + 50);
}, 1000 / 60);

