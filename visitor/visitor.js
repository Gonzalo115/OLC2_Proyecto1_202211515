
/**

 * @typedef {import('./nodos.js').Expresion} Expresion


 * @typedef {import('./nodos.js').Aritmetica} Aritmetica


 * @typedef {import('./nodos.js').Aritmetica_Unaria} Aritmetica_Unaria


 * @typedef {import('./nodos.js').Agrupacion} Agrupacion


 * @typedef {import('./nodos.js').Numero} Numero


 * @typedef {import('./nodos.js').Cadena} Cadena


 * @typedef {import('./nodos.js').Booleano} Booleano


 * @typedef {import('./nodos.js').Char} Char


 * @typedef {import('./nodos.js').DeclaracionVariable} DeclaracionVariable


 * @typedef {import('./nodos.js').ReferenciaVariable} ReferenciaVariable


 * @typedef {import('./nodos.js').Println} Println


 * @typedef {import('./nodos.js').ExpresionStmt} ExpresionStmt

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }
    

    /**
     * @param {Aritmetica} node
     * @returns {any}
     */
    visitAritmetica(node) {
        throw new Error('Metodo visitAritmetica no implementado');
    }
    

    /**
     * @param {Aritmetica_Unaria} node
     * @returns {any}
     */
    visitAritmetica_Unaria(node) {
        throw new Error('Metodo visitAritmetica_Unaria no implementado');
    }
    

    /**
     * @param {Agrupacion} node
     * @returns {any}
     */
    visitAgrupacion(node) {
        throw new Error('Metodo visitAgrupacion no implementado');
    }
    

    /**
     * @param {Numero} node
     * @returns {any}
     */
    visitNumero(node) {
        throw new Error('Metodo visitNumero no implementado');
    }
    

    /**
     * @param {Cadena} node
     * @returns {any}
     */
    visitCadena(node) {
        throw new Error('Metodo visitCadena no implementado');
    }
    

    /**
     * @param {Booleano} node
     * @returns {any}
     */
    visitBooleano(node) {
        throw new Error('Metodo visitBooleano no implementado');
    }
    

    /**
     * @param {Char} node
     * @returns {any}
     */
    visitChar(node) {
        throw new Error('Metodo visitChar no implementado');
    }
    

    /**
     * @param {DeclaracionVariable} node
     * @returns {any}
     */
    visitDeclaracionVariable(node) {
        throw new Error('Metodo visitDeclaracionVariable no implementado');
    }
    

    /**
     * @param {ReferenciaVariable} node
     * @returns {any}
     */
    visitReferenciaVariable(node) {
        throw new Error('Metodo visitReferenciaVariable no implementado');
    }
    

    /**
     * @param {Println} node
     * @returns {any}
     */
    visitPrintln(node) {
        throw new Error('Metodo visitPrintln no implementado');
    }
    

    /**
     * @param {ExpresionStmt} node
     * @returns {any}
     */
    visitExpresionStmt(node) {
        throw new Error('Metodo visitExpresionStmt no implementado');
    }
    
}
