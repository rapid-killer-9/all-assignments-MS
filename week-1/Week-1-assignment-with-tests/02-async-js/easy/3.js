const fs = require("fs")

fs.readFile('a.txt','utf8',function (err, data){
    if(err){
        console.error(err);
        return;
    } else {
        console.log(data);
    }
})