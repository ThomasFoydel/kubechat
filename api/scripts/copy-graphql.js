const fs = require('fs')
const path = require('path')

const sourceDir = path.join(__dirname, '..', 'src', 'graphql')

const targetDir = path.join(__dirname, '..', 'dist', 'graphql')

function copyGraphqlFiles(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true })

  for (const entry of fs.readdirSync(sourceDir, {
    withFileTypes: true,
  })) {
    const sourcePath = path.join(sourceDir, entry.name)
    const targetPath = path.join(targetDir, entry.name)

    if (entry.isDirectory()) {
      copyGraphqlFiles(sourcePath, targetPath)
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.graphql')) {
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}

copyGraphqlFiles(sourceDir, targetDir)
