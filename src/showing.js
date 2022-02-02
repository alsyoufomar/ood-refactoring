class Showing {
  constructor (film, startTime, intendedEndTimeHours, intendedEndTimeMinutes) {
    this.film = film
    this.startTime = startTime
    this.endTime = intendedEndTimeHours + ":" + intendedEndTimeMinutes
  }
}

module.exports = Showing