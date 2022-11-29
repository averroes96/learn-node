const fs = require('fs')

if (!fs.existsSync('./files/new')) {
    fs.mkdir('./files/new', err => {
        if (err) throw err
        console.log('Dir created.')
        if (fs.existsSync('./files/new')) {
            fs.rmdir('./files/new', err => {
                if (err) throw err
                console.log('Dir removed.')
            })
        }
    })
}