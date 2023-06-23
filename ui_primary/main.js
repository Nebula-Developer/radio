const resizeConfig = {
    preserveAspectRatio: false,
    edges: { left: false, right: false, bottom: false, top: false },
    margin: 5,
    restrictSize: { min: { width: 200, height: 200 }, max: { width: 500, height: 500 } }
}

for (const edge of Object.keys(resizeConfig.edges)) {
    const className = `.resize-${edge}`
    interact(className)
        .resizable({ ...resizeConfig, edges: { [edge]: true } })
        .on('resizemove', (e) => { resizeMoveListener(e, (edge == 'left' || edge == 'right')) })
}

function resizeMoveListener(event, widthResize) {
    var target = event.target;

    if (target.classList.contains('variable-panel')) {
        var variable = target.getAttribute('data-variable');
        document.documentElement.style.setProperty(`--${variable}`, (widthResize ? event.rect.width : event.rect.height) + 'px');
    } else {
        var whType = widthResize ? 'width' : 'height';
        target.style[whType] = event.rect[whType] + 'px';
    }

}
