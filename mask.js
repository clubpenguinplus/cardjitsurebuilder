const InputDir = "./raw"

const sharp = require('sharp')
const fs = require('fs').promises

const ImageWidth = 1520
const ImageHeight = 960

async function processFolder(folder) {
    const files = await fs.readdir(`${InputDir}/${folder}`)
    let resize = {}
    for (let file of files) {
        if (file.includes("_ref_") && file.includes("0001")) {
            var fileName = before(file, "_ref_")
            resize[fileName] = await getImageArea(folder, file)
        }
    }

    for (let file of files) {
        if (file.includes("_ref_")) {
            await fs.unlink(`${InputDir}/${folder}/${file}`)
        } else {
            let fileNameArr = file.split("_")
            fileNameArr.pop()
            let fileName = fileNameArr.join("_")
            if (resize[fileName]) {
                await sharp(`${InputDir}/${folder}/${file}`)
                    .extract(resize[fileName])
                    .toBuffer((err, buffer) => {
                        if (err) {
                            console.error(err)
                        } else {
                            fs.writeFile(`${InputDir}/${folder}/${file}`, buffer)
                        }
                    })
            }
        }
    }
}

async function getImageArea(folder, file) {
    const data = await sharp(`${InputDir}/${folder}/${file}`)
        .raw()
        .toBuffer({
            resolveWithObject: true
        })
    for (let y = 0; y < data.info.height; y++) {
        for (let x = 0; x < data.info.width; x++) {
            let rgb = getRGB(data, x, y)
            if (rgb.r == 0 && rgb.g == 255 && rgb.b == 0) {
                return {
                    left: x,
                    top: y,
                    width: ImageWidth,
                    height: ImageHeight
                }
            }
        }
    }
}

function before(value, delimiter) {
    value = value || ''
    return delimiter === '' ?
        value :
        value.split(delimiter).shift()
}

function getRGB(data, x, y) {
    let index = (x + y * data.info.width) * data.info.channels
    return {
        r: data.data[index],
        g: data.data[index + 1],
        b: data.data[index + 2],
        a: data.data[index + 3]
    }
}

async function main() {
    const folders = await fs.readdir(InputDir)
    for (let folder of folders) {
        if (folder.includes(".")) continue
        await processFolder(folder)
    }
}

main().catch(console.error)