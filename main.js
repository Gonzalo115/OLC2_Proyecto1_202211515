import { parse } from './analizador/analizador.js'
import { InterpreterVisitor } from './visitor/interprete.js'
import { Errores } from './utils/errores.js'


const editor = document.getElementById('textAreaEditor')
const consola = document.getElementById('textAreaConsola')
const btnAnalizar = document.getElementById('analizar')


let i = 0;


// Definición de la función de análisis semántico
function analisisSemantico(sentencias, interprete) {
    try{
        while (i < sentencias.length){
            sentencias[i].accept(interprete);
            i ++;
        }
        consola.value = interprete.salida;
    } catch (error) {
        if (error instanceof Errores) {
            console.log(error.toString());
            analisisSemantico(sentencias, interprete, i++)
        }
        console.log(error.message)
        return error
    }

}



btnAnalizar.addEventListener('click', () => {
    const codigoFuente = editor.value
    i = 0;
    try {
        const sentencias = parse(codigoFuente)
        const interprete = new InterpreterVisitor()
        console.log({ sentencias })
        analisisSemantico(sentencias, interprete, i)
    } catch (error) {
        console.log(error.message + ' at line ' + 0 + ' column ' + 0)
    }

})