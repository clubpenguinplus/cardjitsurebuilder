var animSprite
var document


var inputFolderLocation = fl.browseForFolderURL("Select a folder to input from.");
var files = FLfile.listFolder(inputFolderLocation + "/*.fla", "files");

var folderURI = fl.browseForFolderURL("Select a folder to output to.");

for (var f in files) {
    var file = files[f]
    document = fl.openDocument(inputFolderLocation + "/" + file)
    generateJson(file.slice(0, -4))
}

function generateJson(animName) {
    var library = document.library
    var animations = []

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
		
		animations.push('"' + name + '": {"x":0, "y":0}')
    }
	FLfile.write(folderURI + "/" + animName + ".data", '{' + animations.join(', ') + '}')
    fl.closeDocument(fl.documents[0], false);
}