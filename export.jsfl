var animSprite
var document


var inputFolderLocation = fl.browseForFolderURL("Select a folder to input from.");
var files = FLfile.listFolder(inputFolderLocation + "/*.fla", "files");

var folderURI = fl.browseForFolderURL("Select a folder to output to.");

for (var f in files) {
    var file = files[f]
    document = fl.openDocument(inputFolderLocation + "/" + file)
    exportAnimation(file.slice(0, -4))
}

function addMaskParent(lastLayer) {
    var needsRef = false
    var parLayer = document.getTimeline().layers[lastLayer]
    for (var l = lastLayer + 1; l < document.getTimeline().layers.length; l++) {
        if (document.getTimeline().layers[l].layerType == "mask") {
            needsRef = true
            continue
        }

        if (document.getTimeline().layers[l].parentLayer) {
            if (document.getTimeline().layers[l + 1] && document.getTimeline().layers[l + 1].parentLayer) {
                continue
            }

            var layerIndex = document.getTimeline().addNewLayer("Mask Layer", "mask")
            document.addNewRectangle({
                left: -420,
                top: -280,
                right: 340,
                bottom: 200
            }, 0, false, true)
            var parLayer = document.getTimeline().layers[layerIndex]
            if (layerIndex != l + 1) {
                l++
                document.getTimeline().reorderLayer(layerIndex, l + 1)

            }
            if (needsRef){
				addMaskParent(l + 1)
				return true
			} else {
				return addMaskParent(l + 1)
			}
        }

        document.getTimeline().layers[l].parentLayer = parLayer
    }
    return needsRef
}

function exportAnimation(animName) {
    var library = document.library

    var folder = folderURI + "/" + animName
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
        // In each layer, there is one animated sprite: a part of the penguin's body. Sets the 'anim' variable to that sprite
        var anim = layers[l].frames[0].elements[0]
        var name

        // Gets the name of the animation. If it does not have a given name, we name it after the layer it is found on.
        if (anim.name != "") {
            name = anim.name
        } else {
            name = "layer" + l
        }

        anim.scaleX = 2
        anim.scaleY = 2

        library.editItem(anim.libraryItem.name)

        document.getTimeline().layers[0].locked = false

        var fill = document.getCustomFill("toolbar");
        fill.color = "#ffffff00"
        document.setCustomFill(fill)

        document.addNewRectangle({
            left: -420,
            top: -280,
            right: 340,
            bottom: 200
        }, 0, false, true)

        var layerIndex = document.getTimeline().addNewLayer("Mask Layer", "mask")
        var parLayer = document.getTimeline().layers[layerIndex]

        if (layerIndex != 0) {
            document.getTimeline().reorderLayer(layerIndex, 0)
        }

        document.addNewRectangle({
            left: -420,
            top: -280,
            right: 340,
            bottom: 200
        }, 0, false, true)


        var needsRef = addMaskParent(0)

        // Exports the animation sprite to an image sequence
        anim.libraryItem.exportToPNGSequence(folder + "/" + name + '_.png', 1, anim.libraryItem.timeline.frameCount, anim.matrix)

        if (needsRef) {
            var fill = document.getCustomFill("toolbar");
            fill.color = "#00ff00ff"
            document.setCustomFill(fill)

            var lIndex = document.getTimeline().addNewLayer("Reference Layer")

            if (lIndex != 0) {
                document.getTimeline().reorderLayer(lIndex, 0)
            }

            document.addNewRectangle({
                left: -420,
                top: -280,
                right: 340,
                bottom: 200
            }, 0, false, true)
			
            anim.libraryItem.exportToPNGSequence(folder + "/" + name + '_ref_.png', 1, anim.libraryItem.timeline.frameCount, anim.matrix)            
        }
    }
    fl.closeDocument(fl.documents[0], false);
}