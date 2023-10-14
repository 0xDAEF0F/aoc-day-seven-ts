import { set } from 'lodash'

interface Asset {
    name: string;
    type: 'file' | 'directory';
    size?: number;
    children?: { [name: string]: Asset };
}

export class MyFileSystem {
    currentPath: string[] = []
    children: Record<string, Asset> = {}
    totalSum: number = 0

    constructor() { }

    addDirectory(name: string) {
        const newDir: Asset = { name, type: 'directory', children: {} }

        if (this.currentPath.length === 0) {
            set(this.children, name, newDir)
        } else {
            const path = this.currentPath.flatMap((n) => [n, "children"]).concat(name)
            set(this.children, path, newDir)
        }
    }

    addFile(name: string, size: number) {
        const newFile: Asset = { name, size, type: 'file' }

        if (this.currentPath.length === 0) {
            set(this.children, name, newFile)
        } else {
            const path = this.currentPath.flatMap((n) => [n, "children"]).concat(name)
            set(this.children, path, newFile)
        }
    }

    changeDirectory(where: string) {
        if (where === '..') {
            this.currentPath.pop()
        } else {
            this.currentPath.push(where)
        }
    }

    findTotalSizeFileSystem() {
        this.totalSum = 0
        this.goFindSize(this.children)
        return this.totalSum
    }

    private goFindSize(asset: Record<string, Asset>): number {
        if (Object.keys(asset).length === 0) return 0

        let totalSize = 0

        for (let k in asset) {
            if (asset[k].type === 'file') {
                totalSize += asset[k].size!
            } else if (asset[k].type === 'directory') {
                totalSize += this.goFindSize(asset[k].children!)
            }
        }

        if (totalSize <= 100_000) {
            this.totalSum += totalSize
        }

        return totalSize
    }
}
