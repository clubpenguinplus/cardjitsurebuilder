var animSprite
var document

var inputFolderLocation = fl.browseForFolderURL('Select a folder to input from.')
var files = FLfile.listFolder(inputFolderLocation + '/*.fla', 'files')

var folderURI = fl.browseForFolderURL('Select a folder to output to.')

for (var f in files) {
    var file = files[f]
    document = fl.openDocument(inputFolderLocation + '/' + file)
    exportAnimation(file.slice(0, -4))
}

function exportAnimation(animName) {
    var library = document.library
    document.getTimeline().addNewLayer()

    var folder = folderURI + '/' + animName
    FLfile.createFolder(folder)

    // Search through the library to find the one which has a label. This contains the animation.
    for (var i in library.items) {
        if (library.items[i].linkageIdentifier) {
            // Sets the 'animSprite' variable to the animation
            animSprite = library.items[i]
            break
        }
    }

    // Iterate through each layer of the animation timeline
    var layers = animSprite.timeline.layers
    for (var l in layers) {
        try {
            // In each layer, there is one animated sprite: a part of the penguin's body. Sets the 'anim' variable to that sprite
            var anim = layers[l].frames[0].elements[0]
            var name

            // Gets the name of the animation. If it does not have a given name, we name it after the layer it is found on.
            if (anim.name != '') {
                name = anim.name
            } else {
                name = 'layer' + l
            }

            var libraryItem = anim.libraryItem
            animSprite.timeline.copyLayers(parseInt(l))

            document.getTimeline().pasteLayers()
            fl.trace(libraryItem.timeline.frameCount)
            document.selectAll()
            document.moveSelectionBy({x: 380, y: 240})
            for (var f = 0; f < libraryItem.timeline.frameCount; f++) {
                var fname = f.toString()
                while (fname.length < 4) {
                    fname = '0' + fname
                }
                document.exportPNG(folder + '/' + name + '_' + fname + '.png', true, true)
                for (var sl = 0; sl < libraryItem.timeline.layerCount; sl++) {
                    libraryItem.timeline.currentLayer = sl
                    libraryItem.timeline.removeFrames(0)
                }
            }
            document.getTimeline().deleteLayer(0)
        } catch (error) {
            fl.trace(error)
            continue
        }
    }
    fl.closeDocument(fl.documents[0], false)
}
