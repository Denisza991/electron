const fs = require('fs/promises')

document.addEventListener('DOMContentLoaded', async () => {
    const mainContent = document.getElementById('main-content')
    const modules = await getModules()
    
    const navList = document.getElementById('nav-list')
    for (const moduleName of modules) {
        if (moduleName === 'main') continue
        const icon = await getIcon(`./modules/${moduleName}/index.svg`)
        const li = document.createElement('li')
        li.classList.add('nav-item')
        li.id = moduleName.toLowerCase()
        li.innerHTML = template(icon, moduleName.charAt(0).toUpperCase() + moduleName.slice(1))
        li.addEventListener('click', async () => {
            // Clear existing content
            mainContent.innerHTML = ''
            // Load module HTML
            const moduleHtml = await fs.readFile(`./modules/${moduleName}/index.html`, 'utf8')
            mainContent.innerHTML = moduleHtml
            // Load module CSS
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = `./modules/${moduleName}/index.css`
            link.id = `${moduleName}-css`
            document.head.appendChild(link)
            // Load module JS
            const script = document.createElement('script')
            script.src = `./modules/${moduleName}/index.js`
            script.id = `${moduleName}-js`
            document.body.appendChild(script)
        })
        navList.appendChild(li)
    }
})

const template = (icon, label) => {
    return `
        <li class="nav-item" id="${label.toLowerCase()}">
            <span class="icon">${icon}</span>
            <span class="label">${label}</span>
        </li>
    `
}

const getIcon = async (svgPath) => {
    return await fs.readFile(svgPath, 'utf8')
}

const getModules = async () => {
    return await fs.readdir('./modules')
}