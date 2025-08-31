function updateClock() {
    const clock = document.getElementById('clock')
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    clock.textContent = `${hours}:${minutes}:${seconds}`
}
console.log(123)
updateClock()
window.clockIntervals = window.clockIntervals || []
window.clockIntervals.push(setInterval(updateClock, 1000))