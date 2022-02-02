const Screen = require('./screen')
const Film = require('./film')
const Showing = require('./showing')
const CAPACITY = 100
const validity = ['PG', 'U', '12', '15', '18']
const CLEANING = 20

class Cinema {

  constructor () {
    this.films = []
    this.screens = []
  }

  addNewScreen (screenName, _capacity) {
    if (_capacity > CAPACITY) return 'Exceeded max capacity'
    const screen = this.screens.find(x => x.name === screenName)
    if (screen) return 'Screen already exists'
    this.screens.push(new Screen(screenName, _capacity))
  }

  validDuration (duration) {
    const result = this.exp(duration)
    if (result == null) return false
    if ((result[1]) <= 0 || (result[2]) > 60) return false
  }

  addNewFilm (movieName, rating, duration) {
    const movie = this.films.find(x => x.name === movieName)
    if (movie) return 'Film already exists'
    if (!validity.includes(rating)) return 'Invalid rating'
    this.films.push(new Film(movieName, rating, duration))
    return this.validDuration(duration)
  }

  exp (time) {
    return (/^(\d?\d):(\d\d)$/).exec(time)
  }

  //Add a showing for a specific film to a screen at the provided start time
  addShowing (movie, screenName, startTime) {

  }

  add (movie, screenName, startTime) {
    const intendedStartTimeHours = parseInt(this.exp(startTime)[1])
    const intendedStartTimeMinutes = parseInt(this.exp(startTime)[2])

    //Find the film by name
    let film = this.films.find(x => x.name === movie)
    if (!film) return 'Invalid film'
    const durationHours = parseInt(this.exp(film.duration)[1])
    const durationMins = parseInt(this.exp(film.duration)[2])

    //Add the running time to the duration
    let intendedEndTimeHours = intendedStartTimeHours + durationHours
    let intendedEndTimeMinutes = intendedStartTimeMinutes + durationMins + CLEANING
    if (intendedEndTimeMinutes >= 60) {
      intendedEndTimeHours += Math.floor(intendedEndTimeMinutes / 60)
      intendedEndTimeMinutes = intendedEndTimeMinutes % 60
    }
    if (intendedEndTimeHours >= 24) return 'Invalid start time - film ends after midnight'

    //Find the screen by name
    let theatre = this.screens.find(x => x.name === screenName)
    if (!theatre) return 'Invalid screen'
    const test = this.overlap(theatre, intendedStartTimeHours, intendedStartTimeMinutes, intendedEndTimeHours, intendedEndTimeMinutes)
    if (test === 'Time unavailable') return test
    this.showingAdder(theatre.showings, film, startTime, intendedEndTimeHours, intendedEndTimeMinutes)
  }

  overlap (theatre, IHstartTime, IMstartTime, IHendTime, IMendTime) {
    let error = false
    for (let i = 0; i < theatre.showings.length; i++) {
      //Get the start time in hours and minutes
      const startTime = theatre.showings[i].startTime
      const startTimeHours = parseInt(this.exp(startTime)[1])
      const startTimeMins = parseInt(this.exp(startTime)[2])
      //Get the end time in hours and minutes
      const endTime = theatre.showings[i].endTime
      const endTimeHours = parseInt(this.exp(endTime)[1])
      const endTimeMins = parseInt(this.exp(endTime)[2])
      //if intended start time is between start and end
      const d1 = new Date()
      this.dateFunc(d1, IMstartTime, IHstartTime)
      const d2 = new Date()
      this.dateFunc(d2, IMendTime, IHendTime)
      const d3 = new Date()
      this.dateFunc(d3, startTimeMins, startTimeHours)
      const d4 = new Date()
      this.dateFunc(d4, endTimeMins, endTimeHours)

      if ((d1 > d3 && d1 < d4) || (d2 > d3 && d2 < d4) || (d1 < d3 && d2 > d4)) {
        error = true
        return 'Time unavailable'
      }
    }
  }

  showingAdder (list, film, startTime, intendedEndTimeHours, intendedEndTimeMinutes) {
    list.push(new Showing(film, startTime, intendedEndTimeHours, intendedEndTimeMinutes))
  }

  dateFunc (d, mins, hours) {
    d.setMilliseconds(0)
    d.setSeconds(0)
    d.setMinutes(mins)
    d.setHours(hours)
  }

  allShowings () {
    let showings = {}
    for (let i = 0; i < this.screens.length; i++) {
      const screen = this.screens[i]
      for (let j = 0; j < screen.showings.length; j++) {
        const showing = screen.showings[j]
        if (!showings[showing.film.name]) {
          showings[showing.film.name] = []
        }
        showings[showing.film.name].push(`${screen.name} ${showing.film.name} (${showing.film.rating}) ${showing.startTime} - ${showing.endTime}`)
      }
    }

    return showings
  }
}

module.exports = Cinema

const cima = new Cinema()

cima.addNewScreen('screen 1', 10)
cima.addNewScreen('screen 2', 20)
cima.addNewScreen('screen 3', 30)
console.log('I am a screens list', cima.screens)

cima.addNewFilm('badboys 1', '12', '2:00')
cima.addNewFilm('lalaland', '15', '3:45')
console.log('I am a film list', cima.films)

cima.add('badboys 1', 'screen 1', '2:40')

console.log('I am a screens list', cima.screens[0].showings)