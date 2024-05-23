const fs = require('fs')

let data = 'Namaste';

fs.writeFile('a.txt',data,'utf8',function (err){
    if(err){
        console.error(err);
        return;
    }
    console.log('Check the file mostly content had been overwritten')
})