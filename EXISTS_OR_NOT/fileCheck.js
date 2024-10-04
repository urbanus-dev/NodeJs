const fs = require('node:fs');
const folderName = '/home/urbanus/test_folder';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

} catch (err) {

  console.error(err);

}