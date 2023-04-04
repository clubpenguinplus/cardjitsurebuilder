const TexturePacker = '"C:/Program Files/CodeAndWeb/TexturePacker/bin/TexturePacker.exe"'
const InputDir = "./raw"
const OutputDir = "./output"
const OutputTextureFormat = "webp"
const OutputFormat = "phaser"

const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')

const folders = fs.readdirSync(InputDir)
for (let folder of folders) {
    if (folder.includes(".")) continue
    let command = `${TexturePacker} --texture-format ${OutputTextureFormat} --format ${OutputFormat} --data ${OutputDir}/${folder}.json  --trim-sprite-names --multipack ${InputDir}/${folder}`
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
            return
        }
        if (stderr) {
            console.error(stderr)
        }
        console.log(stdout)
    })
}