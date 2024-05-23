var counter = 1;

function callback(){
    console.clear()
    console.log(counter++)
    setTimeout(callback,1000)
}

setTimeout(callback,1000)