const fs = require('fs').promises;
const path = require('path');

async function directoryToTree(rootDir, depth) {
  async function buildTree(dirPath, currentDepth) {
    const stats = await fs.stat(dirPath);  
    const itemName = path.basename(dirPath); 
    
    const node = {
      name: itemName,
      path: path.relative(process.cwd(), dirPath),  
      type: stats.isDirectory() ? 'dir' : 'file',
      size: stats.size  
    };
    if (node.type === 'file') {
      return node;
    }

    if (currentDepth >= depth) {
      node.children = [];
      return node;
    }
    node.children = [];
    const children = await fs.readdir(dirPath); 

    for (const child of children) {
      const childPath = path.join(dirPath, child);  
      const childNode = await buildTree(childPath, currentDepth + 1);  
      node.children.push(childNode);  
    }

    return node;
  }
  return await buildTree(rootDir, 0);
}

module.exports =  directoryToTree;
