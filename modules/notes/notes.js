function updateClock() {
    const clock = document.getElementById('notes')
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    clock.textContent = `${hours}:${minutes}:${seconds}`
}
updateClock()
window.notesIntervals = window.notesIntervals || []
window.notesIntervals.push(setInterval(updateClock, 1000))