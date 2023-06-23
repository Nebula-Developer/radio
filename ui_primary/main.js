const resizeConfig = {
    preserveAspectRatio: false,
    edges: { left: false, right: false, bottom: false, top: false },
    margin: 5
}

for (const edge of Object.keys(resizeConfig.edges)) {
    const className = `.resize-${edge}`
    interact(className)
        .resizable({ ...resizeConfig, edges: { [edge]: true } })
        .on('resizemove', (e) => { resizeMoveListener(e, (edge == 'left' || edge == 'right')) })
}

function resizeMoveListener(event, widthResize) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    if (widthResize)
        target.style.width  = event.rect.width + 'px';
    else
        target.style.height = event.rect.height + 'px';

    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
