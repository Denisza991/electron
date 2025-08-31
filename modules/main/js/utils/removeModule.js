const clearModuleScripts = async () => {
    if (currentModule && window[currentModule + 'Intervals']) {
        window[currentModule + 'Intervals'].forEach(id => clearInterval(id))
        window[currentModule + 'Intervals'] = []
    }
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ''
}

module.exports = clearModuleScripts