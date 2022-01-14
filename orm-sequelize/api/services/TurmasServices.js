const Services = require('./Services')
const MatriculasServices = require('./MatriculasServices')

class TurmasServices extends Services {
    constructor() {
        super('Turmas')
        this.matriculas = new MatriculasServices()
    }

}

module.exports = TurmasServices