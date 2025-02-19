const fs = require("fs").promises;
const path = require("path");  //current working directory
const {promisify} = require("util");
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitID){
    const repoPath = path.resolve(process.cwd(), ".MyGit");  //Repo path
    const commitsPath = path.join(repoPath, "commit");
    try {
        const commitDir = path.join(commitsPath, commitID);
        const files = await readdir(commitDir);
        const parentDir = path.resolve(repoPath, "..");
        for(const file of files)
        {
            await copyFile(path.join(commitDir, file), path.join(parentDir, file));
        }
        console.log(`Commit ${commitID} reverted successfully..!!`);
    }
    catch(err) {
        console.error("Unable to revert : ", err);
    }
}

module.exports={revertRepo};

    