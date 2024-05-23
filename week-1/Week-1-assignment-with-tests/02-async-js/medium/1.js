const fs = require('fs')

function clean(data){
    var arr = data.split(" ");
    var answerArray = [];
    for(var i = 0;i<arr.length;i++){
        if(arr[i].length===0){
            continue;
        }
        else {
            answerArray.push(arr[i]);
        }
    }
    var asnwerString = answerArray.join(" ");
    // console.log(asnwerString)
    return asnwerString;
}

function fileRead(err, data){
    if(err){
        console.error(err)
        return;
    }

    let cleanedData = clean(data);

    fs.writeFile('a.txt',cleanedData,'utf8',function(err){
        if(err){
            console.error(err)
        }
        console.log('Done')
    })
}

fs.readFile('a.txt','utf8',fileRead)