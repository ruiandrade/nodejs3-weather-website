const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()


//Define 
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather app',
        name: 'Rui Andrade'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Rui Andrade'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'Contact Mr. A for help',
        name: 'Rui Andrade'
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Articles not found',
        message: 'Look for other articles',
        name: 'Rui Andrade'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.adress) {
        return res.send({
            error: 'you must provide an adress'
        })
    }
    geocode(req.query.adress, (error, data) => {
        if (error) {
            return res.send({
                error: error
            })
        }
        forecast(data.latitude, data.longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            res.send({
                location: data.location,
                forecast: forecastData,
                adress: req.query.adress
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search term'
        })
    }
    
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: 'Error 404',
        message: 'Page not found',
        name: 'Rui Andrade'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})