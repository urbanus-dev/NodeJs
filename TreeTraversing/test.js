const fs = require('fs').promises;
const path = require('path');

async function directoryToTree(rootDir, depth) {
  // Recursive helper function to build the tree
  async function buildTree(dirPath, currentDepth) {
    const stats = await fs.stat(dirPath);  // Get stats for the directory or file
    const itemName = path.basename(dirPath); // Extract the name of the file/dir
    
    // Create the node object
    const node = {
      name: itemName,
      path: path.relative(process.cwd(), dirPath),  // Relative path from current working directory
      type: stats.isDirectory() ? 'dir' : 'file',
      size: stats.size  // The size in bytes
    };

    // Return early if it's a file (files have no children)
    if (node.type === 'file') {
      return node;
    }

    // Return early if current depth exceeds allowed depth, but keep the directory structure (empty children)
    if (currentDepth >= depth) {
      node.children = [];
      return node;
    }

    // If it's a directory and within the depth, recursively process its children
    node.children = [];
    const children = await fs.readdir(dirPath); // Get the contents of the directory

    for (const child of children) {
      const childPath = path.join(dirPath, child);  // Construct the full path for the child
      const childNode = await buildTree(childPath, currentDepth + 1);  // Recursively build the tree for the child
      node.children.push(childNode);  // Add the child node to children array
    }

    return node;
  }

  // Start building the tree from the root directory with depth 0
  return await buildTree(rootDir, 0);
}

// Export the function for testing
module.exports =  directoryToTree;
