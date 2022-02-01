class Screen {
    constructor (screenName, _capacity) {
        this.name = screenName
        this.capacity = _capacity
        this.showings = []
    }

    // addNewScreen (screenName, _capacity) {
    //     if (_capacity > CAPACITY) return 'Exceeded max capacity'
    //     const screen = this.screens.find(x => x.name === screenName)
    //     if (screen) return 'Screen already exists'
    //     this.screens.push(new Screen(screenName, _capacity))
    // }
}

module.exports = Screen
