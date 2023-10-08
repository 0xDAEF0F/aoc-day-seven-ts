import * as dotenv from 'dotenv'
import path from 'path'
import { promises as fs } from 'fs'
dotenv.config()

async function main() {
    const filePath = path.join(__dirname, '..', 'input-day-7.txt')
    const data = await fs.readFile(filePath, 'utf8')

    console.log(data)
}

main()
