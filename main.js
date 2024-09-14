import { parse } from './analizador/analizador.js'
import { InterpreterVisitor } from './visitor/interprete.js'
import { Errores } from './utils/errores.js'


const editor = document.getElementById('textAreaEditor')
const consola = document.getElementById('textAreaConsola')
const btnAnalizar = document.getElementById('analizar')

btnAnalizar.addEventListener('click', () => {
    const codigoFuente = editor.value
    const sentencias = parse(codigoFuente)
    const interprete = new InterpreterVisitor()

    console.log({ sentencias })
    for (let i = 0; i < sentencias.length; i++) {
        var error = sentencias[i].accept(interprete)
        if (error instanceof Errores) {
            console.log(error.toString());
        }
    }
    consola.value = interprete.salida
})