const fs = require("fs");

// run main code
main();

function main() {
    let code = getRawCode();

    fs.writeFile(__dirname + "/rawcode.txt", code, err => {
        if (err) throw err;
    });

    uploadCloudScript(code);
}

function getRawCode() {

    let fileList = [];

    let sourceFolders = [
        'SourcePass1',
        //'SourcePass2',
        'SourcePassFinal'
    ];

    for (let folder of sourceFolders) {
        let dirPath = __dirname + '/cloudScript/' + folder;
        getFiles(fileList, dirPath);
    }

    let rawCode = "";

    fileList.forEach(path => {
        let rawString = fs.readFileSync(path);
        rawCode += "\r\n" + rawString;
    });

    return rawCode;
}

function getFiles(fileList, dir) {
    let files = fs.readdirSync(dir);
    for (let i in files) {
        if (!files.hasOwnProperty(i) || files[i] === ".DS_Store") continue;
        let name = dir + "/" + files[i];
        if (!fs.statSync(name).isDirectory()) {
            fileList.push(name);
        } else {
            getFiles(fileList, name);
        }
    }
}

function uploadCloudScript(content) {

    // const https = require('https');
    const request = require("request");

    let options = {
        url: `https://us-central1-clan-chat-test.cloudfunctions.net/deploy`,
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        json: {
            source : content,
            titleId : "server1"
        }
    };

    // Set up the request
    request(options, function (error, response, body) {
        console.log(body);
    });

//     const req = https.request(options, res => {

//         console.log('statusCode:', res.statusCode);

//         res.setEncoding('utf8');

//         res.on('data', (d) => {
//             console.log(  d );
//         });
//   });
}
