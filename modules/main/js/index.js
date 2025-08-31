const fs = require('fs/promises')

let currentModule = null
let theme = 'dark'
const mainContent = document.getElementById('main-content')

document.addEventListener('DOMContentLoaded', async () => {

    await buildNavList()
    await addThemeToggle()
})

const template = (icon, label) => {
    return `
        <span class="icon">${icon}</span>
        <span class="label">${label}</span>
    `
}

const getIcon = async (svgPath) => {
    return await fs.readFile(svgPath, 'utf8')
}

const getModules = async () => {
    return await fs.readdir('./modules')
}

const buildNavList = async () => {
    const modules = await getModules()
    const navList = document.getElementById('nav-list')
    for (const moduleName of modules) {
        if (moduleName === 'main') continue
        const icon = await getIcon(`./modules/${moduleName}/${moduleName}.svg`)
        const li = document.createElement('li')
        li.classList.add('nav-item')
        li.innerHTML = template(icon, moduleName.charAt(0).toUpperCase() + moduleName.slice(1))
        li.addEventListener('click', async () => {
            if (currentModule == moduleName) return
            // await utils.clearModuleScripts(moduleName)
            await loadModuleTheme(moduleName)
            await loadModuleCSS(moduleName)
            await loadModuleHTML(moduleName)
            // Initialize intervals array for the module
            window[moduleName + 'Intervals'] = window[moduleName + 'Intervals'] || []
            await loadModuleJS(moduleName)
            // Set current module
            currentModule = moduleName
        })
        navList.appendChild(li)
    }
}

const loadModuleTheme = async (moduleName) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `../${moduleName}/css/themes/${theme}.css`
    link.id = `${moduleName}-theme-css`
    mainContent.appendChild(link)
}

const loadModuleCSS = async (moduleName) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `../${moduleName}/css/${moduleName}.css`
    link.id = `${moduleName}-module-css`
    mainContent.appendChild(link)
}

const loadModuleJS = async (moduleName) => {
    const script = document.createElement('script')
    script.src = `../${moduleName}/${moduleName}.js`
    script.id = `${moduleName}-module-js`
    mainContent.appendChild(script)
}

const loadModuleHTML = async (moduleName) => {
    const moduleHtml = await fs.readFile(`./modules/${moduleName}/${moduleName}.html`, 'utf8')
    mainContent.innerHTML += moduleHtml
}

const addThemeToggle = async () => {
    const themeToggle = document.getElementById('theme-toggle')
    const currentThemeCSS = document.getElementById('theme')
    if (currentThemeCSS) {
        currentThemeCSS.remove()
    }
    const themeCSS = document.createElement('style')
    themeCSS.id = 'theme'
    themeCSS.textContent = await fs.readFile(__dirname + `/css/themes/${theme}.css`)
    document.head.appendChild(themeCSS)

    themeToggle.addEventListener('click', async () => {
        theme = theme == 'white' ? 'dark' : 'white'
        const currentThemeCSS = document.getElementById('theme')
        if (currentThemeCSS) {
            currentThemeCSS.remove()
        }
        const themeCSS = document.createElement('style')
        themeCSS.id = 'theme'
        themeCSS.textContent = await fs.readFile(__dirname + `/css/themes/${theme}.css`)
        document.head.appendChild(themeCSS)
    })
}