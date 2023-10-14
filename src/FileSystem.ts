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
        const [, total] = this.go(this)
        return total
    }

    findBestCandidate() {
        const [, , best] = this.go(this)
        return best
    }

    private go(
        asset: Asset,
        predicateTotal: number = 0,
        bestCandidate: [string, number] = ['', Infinity]
    ): [number, number, [string, number]] {
        if (Object.keys(asset.children!).length === 0) return [0, predicateTotal, bestCandidate]

        let totalSize = 0
        let newBestCandidate = bestCandidate

        for (let k in asset.children) {
            if (asset.children[k].type === 'file') {
                totalSize += asset.children[k].size!
            } else if (asset.children[k].type === 'directory') {
                const [subSize, newPredicateTotal, candidate] = this.go(
                    asset.children[k],
                    predicateTotal,
                    newBestCandidate
                )
                totalSize += subSize
                predicateTotal = newPredicateTotal
                newBestCandidate = candidate
            }
        }

        // CHALLENGE A
        if (totalSize <= 100_000) {
            predicateTotal += totalSize
        }

        // CHALLENGE B
        if (totalSize >= 3_313_415 && totalSize <= newBestCandidate[1]) {
            newBestCandidate = [asset.name, totalSize]
        }

        return [totalSize, predicateTotal, newBestCandidate]
    }
}
