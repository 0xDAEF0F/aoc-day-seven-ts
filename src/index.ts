import * as dotenv from 'dotenv'
import path from 'path'
import { promises as fs } from 'fs'
dotenv.config()

type FileSystemNode = {
    name: string;
    type: 'file' | 'directory';
    size?: number;
    children?: { [name: string]: FileSystemNode };
}

async function main() {
    const filePath = path.join(__dirname, '..', 'input-day-7.txt')
    const data = await fs.readFile(filePath, 'utf8')
    const lines = data.split('\n')

    const instructionChunks: string[][] = [[]]

    lines.forEach((l) => {
        if (!l.startsWith("$")) {
            instructionChunks[instructionChunks.length - 1].push(l)
        } else {
            instructionChunks.push([l])
        }
    })

    let fileSystem: FileSystemNode = {
        name: "/",
        type: 'directory',
        children: {}
    }

    let pathState = ["/"]

    instructionChunks.forEach((chunk) => {
        if (chunk[0].startsWith("$ cd")) {
            // change `pathState`
            const nextDest = chunk[0].slice(5)
            const goParent = nextDest === '..'

            if (goParent) pathState.pop()
            else pathState.push(nextDest)

        } else if (chunk[0].startsWith("$ ls")) {
            // fill new children
            chunk.forEach((node, i) => {
                // skip first iteration (we know it is the instruction)
                if (i === 0) return

                if (node.startsWith("dir")) {
                    // create directory inside the path
                    const dirName = node.split(' ')[1]
                } else {
                    // it is a regular file (create it)
                    const fileSize = +node.split(' ')[0]
                    const fileName = node.split(' ')[1]
                    const fileSystemNode: FileSystemNode = {
                        type: "file",
                        name: fileName,
                        size: fileSize
                    }
                }
            })
        }
    })
}

main()
