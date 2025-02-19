const fs = require("fs").promises;
const path = require("path");  //current working directory

async function addRepo(filePath){
    const repoPath = path.resolve(process.cwd(), ".MyGit");  //Repo path
    const stagingPath = path.join(repoPath, "staging"); //commits folder path

    try {
        await fs.mkdir(stagingPath, { recursive: true});
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(stagingPath, fileName));
        console.log(`File ${fileName} added to the staging area..!`);
    }
    catch(err) {
        console.error("Error adding file : ", err);
    }
}

module.exports={addRepo};

    