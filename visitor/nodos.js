
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
    
export class Operacion_Unaria extends Expresion {

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
        return visitor.visitOperacion_Unaria(this);
    }
}
    
export class Comparacion extends Expresion {

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
        return visitor.visitComparacion(this);
    }
}
    
export class Relacional extends Expresion {

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
        return visitor.visitRelacional(this);
    }
}
    
export class Logico extends Expresion {

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
        return visitor.visitLogico(this);
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
    
export class DatoPrimitivo extends Expresion {

    /**
    * @param {Object} options
    * @param {any} options.valor Valor del numero
 * @param {string} options.tipo Expresion derecha de la operacion
    */
    constructor({ valor, tipo }) {
        super();
        
        /**
         * Valor del numero
         * @type {any}
        */
        this.valor = valor;


        /**
         * Expresion derecha de la operacion
         * @type {string}
        */
        this.tipo = tipo;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDatoPrimitivo(this);
    }
}
    
export class DeclaracionVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {any} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
 * @param {Expresion|undefined} options.exp Expresion de la variable
    */
    constructor({ tipo, id, exp }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {any}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion|undefined}
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
    
export class Asignacion extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.asgn Expresion a asignar
    */
    constructor({ id, asgn }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.asgn = asgn;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacion(this);
    }
}
    
export class Incremento extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.valor Expresion a asignar
    */
    constructor({ id, valor }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIncremento(this);
    }
}
    
export class Decremento extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.valor Expresion a asignar
    */
    constructor({ id, valor }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDecremento(this);
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
    
export class ExpresionPrintln extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp_left Expresion izquierda de la concatenacion
 * @param {Expresion} options.exp_right Expresion derecha de la concatenacion
    */
    constructor({ exp_left, exp_right }) {
        super();
        
        /**
         * Expresion izquierda de la concatenacion
         * @type {Expresion}
        */
        this.exp_left = exp_left;


        /**
         * Expresion derecha de la concatenacion
         * @type {Expresion}
        */
        this.exp_right = exp_right;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresionPrintln(this);
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
    
export default { Expresion, Aritmetica, Operacion_Unaria, Comparacion, Relacional, Logico, Agrupacion, DatoPrimitivo, DeclaracionVariable, ReferenciaVariable, Asignacion, Incremento, Decremento, Println, ExpresionPrintln, ExpresionStmt }
