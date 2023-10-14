import { set } from 'lodash'

interface Asset {
    name: string
    type: 'file' | 'directory'
    size?: number
    children?: { [name: string]: Asset }
}

export class MyFileSystem implements Asset {
    name = 'root'
    type = 'directory' as const

    currentPath: string[] = []
    children: Record<string, Asset> = {}

    // CHALLENGE A
    private totalSumWithPredicate: number = 0

    // CHALLENGE B
    private bestCandidate: [string, number] = ['', Infinity]
    private target = 3_313_415

    constructor() {}

    addDirectory(name: string) {
        const newDir: Asset = { name, type: 'directory', children: {} }

        if (this.currentPath.length === 0) {
            set(this.children, name, newDir)
        } else {
            const path = this.currentPath.flatMap((n) => [n, 'children']).concat(name)
            set(this.children, path, newDir)
        }
    }

    addFile(name: string, size: number) {
        const newFile: Asset = { name, size, type: 'file' }

        if (this.currentPath.length === 0) {
            set(this.children, name, newFile)
        } else {
            const path = this.currentPath.flatMap((n) => [n, 'children']).concat(name)
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
        this.go(this)

        return this.totalSumWithPredicate
    }

    findBestCandidate() {
        this.go(this)

        return this.bestCandidate
    }

    private go(asset: Asset) {
        if (Object.keys(asset.children!).length === 0) return 0

        let totalSize = 0

        for (let k in asset.children) {
            if (asset.children[k].type === 'file') {
                totalSize += asset.children[k].size!
            } else if (asset.children[k].type === 'directory') {
                totalSize += this.go(asset.children[k])
            }
        }

        if (totalSize >= this.target && totalSize <= this.bestCandidate[1]) {
            this.bestCandidate = [asset.name, totalSize]
        }

        if (totalSize <= 100_000) {
            this.totalSumWithPredicate += totalSize
        }

        return totalSize
    }
}
