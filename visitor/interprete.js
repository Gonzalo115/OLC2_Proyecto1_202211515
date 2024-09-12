import { Entorno } from "../utils/entorno.js";
import { Errores } from "../utils/errores.js";
import { Cadena, Numero } from "./nodos.js";
import { BaseVisitor } from "./visitor.js";


export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();
        this.salida = '';
    }
    
    /**
      * @type {BaseVisitor['visitAritmetica']}
    */
    visitAritmetica(node) {
        const num_left  = node.exp_left.accept(this);
        const num_right = node.exp_right.accept(this);

      if (num_left instanceof Errores){
        return num_left
      }
      if (num_right instanceof Errores){
        return num_right
      }

    
        switch (node.operacion) {
            case '+':
              if(typeof num_left === 'number' && typeof num_right === 'number'){
                return num_left + num_right;
              }
        
              if(typeof num_left === 'string' && typeof num_right === 'string'){
                return num_left + num_right;  
              }
              return new Errores("La suma entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
            case '-':
              if(!(typeof num_left === 'number' && typeof num_right === 'number')){
                return new Errores("La resta entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
              }
              return num_left - num_right;
            case '*':
              if(!(typeof num_left === 'number' && typeof num_right === 'number')){
                return new Errores("La multiplicacion entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
              }
              return num_left * num_right;
            case '/':
              if(!(typeof num_left === 'number' && typeof num_right === 'number')){
                return new Errores("La division entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
              }
              if(num_right == 0){
                return new Errores("La division entre cero no esta permitida", node.location.start.line, node.location.start.column)
              }

              return num_left / num_right;
            case '%':
              if(!(Number.isInteger(num_left) && Number.isInteger(num_right))){
                return new Errores("El modulo entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
              }
              return num_left % num_right;
            default:
                throw new Error(`Operador no soportado: ${node.op}.`);
        }
    }
    

    /**
      * @type {BaseVisitor['visitAritmetica_Unaria']}
    */
    visitAritmetica_Unaria(node) {
        const exp_unica = node.exp.accept(this);
        switch (node.op) {
            case '-':
                return -exp_unica;
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }    }
    
    /**
      * @type {BaseVisitor['visitAgrupacion']}
    */
    visitAgrupacion(node) {
        return node.exp.accept(this);
    }
    
    /**
      * @type {BaseVisitor['visitNumero']}
    */
    visitNumero(node) {
        return node.valor;
    }
    
    /**
      * @type {BaseVisitor['visitCadena']}
    */
    visitCadena(node) {
        return node.valor;
    }
    
    /**
      * @type {BaseVisitor['visitBooleano']}
    */
    visitBooleano(node) {
        return node.valor;
    }
    
    /**
      * @type {BaseVisitor['visitChar']}
    */
    visitChar(node) {
        return node.valor
    }
    
    /**
      * @type {BaseVisitor['visitDeclaracionVariable']}
    */
    visitDeclaracionVariable(node) {
        const nombreVariable = node.id;
        const valorVariable = node.exp.accept(this);

        this.entornoActual.setVariable(nombreVariable, valorVariable);
    }
    
    /**
      * @type {BaseVisitor['visitReferenciaVariable']}
    */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        return this.entornoActual.getVariable(nombreVariable);
    }
    
    /**
      * @type {BaseVisitor['visitPrintln']}
    */
    visitPrintln(node) {
        const valor = node.exp.accept(this);

        if (valor instanceof Errores){
          return valor
        }

        this.salida += valor + '\n';
    }
    
    /**
      * @type {BaseVisitor['visitExpresionStmt']}
    */
    visitExpresionStmt(node) {
        node.exp.accept(this);
    }

}