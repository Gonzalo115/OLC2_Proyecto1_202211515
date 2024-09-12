import { parse } from './analizador/analizador.js'
import { InterpreterVisitor } from './visitor/interprete.js'


const editor = document.getElementById('textAreaEditor')
const consola = document.getElementById('textAreaConsola')
const btnAnalizar = document.getElementById('analizar')

btnAnalizar.addEventListener('click', () => {
    const codigoFuente = editor.value
    const sentencias = parse(codigoFuente)
    ast.innerHTML = JSON.stringify(sentencias, null, 2)
    const interprete = new InterpreterVisitor()

    console.log({ sentencias })
    sentencias.forEach(sentencia => sentencia.accept(interprete))
    consola.value = interprete.salida
})