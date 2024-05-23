/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep(milliseconds) {
    const startTime = Date.now();
    let currentTime = startTime;
    while (currentTime - startTime < milliseconds) {
        currentTime = Date.now();
    }
}