const fs = require("fs").promises;
const path = require("path");  //current working directory

async function initRepo(){
    const repoPath = path.resolve(process.cwd(), ".MyGit");  //Repo path
    const commitsPath = path.join(repoPath, "commit"); //commits folder path

    try {
        await fs.mkdir(repoPath, { recursive: true});
        await fs.mkdir(commitsPath, { recursive: true});
        await fs.writeFile(path.join(repoPath, "config.json"),JSON.stringify({ bucket: process.env.S3_BUCKET}));
        console.log("Repository initialized..!");
}
catch(err) {
    console.error("Error initializing Repository", err);
}
}

module.exports={initRepo};

    