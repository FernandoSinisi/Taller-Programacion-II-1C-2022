class FormattableDateMockDateMock {
    constructor(isoString) {
        this.isoString = isoString;
    }

    toISOString() {
        return this.isoString;
    }

    getHours() {
        return 0;
    }

    setHours(hours) {
        return;
    }
}

module.exports = {
    FormattableDateMockDateMock
}
