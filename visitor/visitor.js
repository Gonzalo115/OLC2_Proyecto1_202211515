
/**

 * @typedef {import('./nodos.js').Expresion} Expresion


 * @typedef {import('./nodos.js').Aritmetica} Aritmetica


 * @typedef {import('./nodos.js').Operacion_Unaria} Operacion_Unaria


 * @typedef {import('./nodos.js').Comparacion} Comparacion


 * @typedef {import('./nodos.js').Relacional} Relacional


 * @typedef {import('./nodos.js').Logico} Logico


 * @typedef {import('./nodos.js').Agrupacion} Agrupacion


 * @typedef {import('./nodos.js').DatoPrimitivo} DatoPrimitivo


 * @typedef {import('./nodos.js').DeclaracionVariable} DeclaracionVariable


 * @typedef {import('./nodos.js').ReferenciaVariable} ReferenciaVariable


 * @typedef {import('./nodos.js').Asignacion} Asignacion


 * @typedef {import('./nodos.js').Incremento} Incremento


 * @typedef {import('./nodos.js').Decremento} Decremento


 * @typedef {import('./nodos.js').Println} Println


 * @typedef {import('./nodos.js').ExpresionPrintln} ExpresionPrintln


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
     * @param {Operacion_Unaria} node
     * @returns {any}
     */
    visitOperacion_Unaria(node) {
        throw new Error('Metodo visitOperacion_Unaria no implementado');
    }
    

    /**
     * @param {Comparacion} node
     * @returns {any}
     */
    visitComparacion(node) {
        throw new Error('Metodo visitComparacion no implementado');
    }
    

    /**
     * @param {Relacional} node
     * @returns {any}
     */
    visitRelacional(node) {
        throw new Error('Metodo visitRelacional no implementado');
    }
    

    /**
     * @param {Logico} node
     * @returns {any}
     */
    visitLogico(node) {
        throw new Error('Metodo visitLogico no implementado');
    }
    

    /**
     * @param {Agrupacion} node
     * @returns {any}
     */
    visitAgrupacion(node) {
        throw new Error('Metodo visitAgrupacion no implementado');
    }
    

    /**
     * @param {DatoPrimitivo} node
     * @returns {any}
     */
    visitDatoPrimitivo(node) {
        throw new Error('Metodo visitDatoPrimitivo no implementado');
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
     * @param {Asignacion} node
     * @returns {any}
     */
    visitAsignacion(node) {
        throw new Error('Metodo visitAsignacion no implementado');
    }
    

    /**
     * @param {Incremento} node
     * @returns {any}
     */
    visitIncremento(node) {
        throw new Error('Metodo visitIncremento no implementado');
    }
    

    /**
     * @param {Decremento} node
     * @returns {any}
     */
    visitDecremento(node) {
        throw new Error('Metodo visitDecremento no implementado');
    }
    

    /**
     * @param {Println} node
     * @returns {any}
     */
    visitPrintln(node) {
        throw new Error('Metodo visitPrintln no implementado');
    }
    

    /**
     * @param {ExpresionPrintln} node
     * @returns {any}
     */
    visitExpresionPrintln(node) {
        throw new Error('Metodo visitExpresionPrintln no implementado');
    }
    

    /**
     * @param {ExpresionStmt} node
     * @returns {any}
     */
    visitExpresionStmt(node) {
        throw new Error('Metodo visitExpresionStmt no implementado');
    }
    
}
