function updateTime() {
    console.clear()
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Add leading zero if the value is less than 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Format time in HH:MM:SS
    const formattedTime24 = hours + ':' + minutes + ':' + seconds;

    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedTime12 = hours + ':' + minutes + ':' + seconds + ' ' + ampm;

    console.log(formattedTime24);
    console.log(formattedTime12);
}

// Update time every second
setInterval(updateTime, 1000);

// Initial call to display time immediately
updateTime();