import { set } from 'lodash'

interface Asset {
    name: string;
    type: 'file' | 'directory';
    size?: number;
    children?: { [name: string]: Asset };
}

export class MyFileSystem {
    currentPath: string[] = []
    children: Asset = { name: '/', type: 'directory' }

    constructor() {
        this.currentPath.push("/")
    }

    addDirectory(name: string) {
        // how deeply nested are we?
        const newDir: Asset = { name, type: 'directory', children: {} }
        const levelsDeep = this.currentPath.length

        const a = "children.".repeat(levelsDeep).slice(0, -1)
        set(this.children, a, newDir)
    }

    addFile(name: string, size: number) {
        const newFile: Asset = { name, size, type: 'file' }

    }
}
