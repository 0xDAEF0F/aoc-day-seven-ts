import * as dotenv from 'dotenv'
import path from 'path'
import { promises as fs } from 'fs'
import { MyFileSystem } from './FileSystem'
dotenv.config()

async function main() {
    const filePath = path.join(__dirname, '..', 'input-day-7.txt')
    const data = await fs.readFile(filePath, 'utf8')
    const lines = data.split('\n')

    const instructionChunks: string[][] = []

    lines.forEach((l) => {
        if (!l.startsWith("$")) {
            instructionChunks[instructionChunks.length - 1].push(l)
        } else {
            instructionChunks.push([l])
        }
    })

    const fileSystem = new MyFileSystem()

    instructionChunks.forEach((chunk) => {
        if (chunk[0].startsWith("$ cd")) {
            // change `pathState`
            const nextDest = chunk[0].slice(5)
            const goParent = nextDest === '..'

            if (goParent) fileSystem.changeDirectory('..')
            else fileSystem.changeDirectory(nextDest)

        } else if (chunk[0].startsWith("$ ls")) {
            chunk.forEach((node, i) => {
                // skip first iteration (we know it is the instruction)
                if (i === 0) return

                if (node.startsWith("dir")) {
                    const dirName = node.split(' ')[1]
                    fileSystem.addDirectory(dirName)
                } else {
                    const fileSize = +node.split(' ')[0]
                    const fileName = node.split(' ')[1]
                    if (fileName) fileSystem.addFile(fileName, fileSize)
                }
            })
        }
    })

    console.log(fileSystem.findTotalSizeFileSystem())
}

main()
