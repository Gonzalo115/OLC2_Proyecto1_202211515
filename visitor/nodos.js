
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion  {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class Aritmetica extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp_left Expresion izquierda de la operacion
 * @param {Expresion} options.exp_right Expresion derecha de la operacion
 * @param {string} options.operacion Operador de la operacion
    */
    constructor({ exp_left, exp_right, operacion }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.exp_left = exp_left;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.exp_right = exp_right;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.operacion = operacion;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAritmetica(this);
    }
}
    
export class Aritmetica_Unaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp_unica Expresion de la operacion
 * @param {string} options.operacion Operador de la operacion
    */
    constructor({ exp_unica, operacion }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp_unica = exp_unica;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.operacion = operacion;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAritmetica_Unaria(this);
    }
}
    
export class Agrupacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAgrupacion(this);
    }
}
    
export class Numero extends Expresion {

    /**
    * @param {Object} options
    * @param {number} options.valor Valor del numero
    */
    constructor({ valor }) {
        super();
        
        /**
         * Valor del numero
         * @type {number}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNumero(this);
    }
}
    
export class Cadena extends Expresion {

    /**
    * @param {Object} options
    * @param {Cadena} options.valor Contenido de una string
    */
    constructor({ valor }) {
        super();
        
        /**
         * Contenido de una string
         * @type {Cadena}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitCadena(this);
    }
}
    
export class Booleano extends Expresion {

    /**
    * @param {Object} options
    * @param {Decimal} options.valor Valor booleano
    */
    constructor({ valor }) {
        super();
        
        /**
         * Valor booleano
         * @type {Decimal}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBooleano(this);
    }
}
    
export class Char extends Expresion {

    /**
    * @param {Object} options
    * @param {caracter} options.valor Valor de un caracter
    */
    constructor({ valor }) {
        super();
        
        /**
         * Valor de un caracter
         * @type {caracter}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitChar(this);
    }
}
    
export class DeclaracionVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion de la variable
    */
    constructor({ id, exp }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVariable(this);
    }
}
    
export class ReferenciaVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVariable(this);
    }
}
    
export class Println extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a imprimir
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a imprimir
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrintln(this);
    }
}
    
export class ExpresionStmt extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresionStmt(this);
    }
}
    
export default { Expresion, Aritmetica, Aritmetica_Unaria, Agrupacion, Numero, Cadena, Booleano, Char, DeclaracionVariable, ReferenciaVariable, Println, ExpresionStmt }
