import { Entorno } from "../utils/entorno.js";
import { Errores } from "../utils/errores.js";
import { Numero, Cadena, Char, Booleano } from "./nodos.js";
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
    const num_left = node.exp_left.accept(this);
    const num_right = node.exp_right.accept(this);

    if (num_left instanceof Errores) {
      return num_left
    }
    if (num_right instanceof Errores) {
      return num_right
    }

    switch (node.operacion) {
      case '+':
        if (num_left instanceof Numero && num_right instanceof Numero) {
          num_left.valor = num_left.valor + num_right.valor
          return num_left
        }

        if (num_left instanceof Cadena && num_right instanceof Cadena) {
          num_left.valor = num_left.valor + num_right.valor
          return num_left
        }
        return new Errores("La suma entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
      case '-':
        if (!(num_left instanceof Numero && num_right instanceof Numero)) {
          return new Errores("La resta entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
        }
        num_left.valor = num_left.valor - num_right.valor
        return num_left
      case '*':
        if (!(num_left instanceof Numero && num_right instanceof Numero)) {
          return new Errores("La multiplicacion entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
        }
        num_left.valor = num_left.valor * num_right.valor
        return num_left
      case '/':
        if (!(num_left instanceof Numero && num_right instanceof Numero)) {
          return new Errores("La division entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
        }
        if (num_right == 0) {
          return new Errores("La division entre cero no esta permitida", node.location.start.line, node.location.start.column)
        }
        if (Number.isInteger(num_left.valor) && Number.isInteger(num_right.valor)) {
          num_left.valor = Math.floor(num_left.valor / num_right.valor)
          return num_left
        }
        num_left.valor = num_left.valor / num_right.valor
        return num_left
      case '%':
        if (!(Number.isInteger(num_left.valor) && Number.isInteger(num_right.valor))) {
          return new Errores("El modulo entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
        }
        num_left.valor = num_left.valor % num_right.valor
        return num_left
      default:
        throw new Error(`Operador no soportado: ${node.op}.`);
    }
  }


  /**
    * @type {BaseVisitor['visitOperacion_Unaria']}
  */
  visitOperacion_Unaria(node) {
    const exp_unica = node.exp_unica.accept(this);

    if (exp_unica instanceof Errores) {
      return exp_unica
    }

    switch (node.operacion) {
      case '-':
        if (!(exp_unica instanceof Numero)) {
          return new Errores("La negacion unaria solo permite numeros", node.location.start.line, node.location.start.column)
        }
        const nodoR = new Numero({ valor: -exp_unica.valor })
        nodoR.location = node.location
        return nodoR;
      case '!':
        if (!(exp_unica instanceof Booleano)) {
          return new Errores("La negacion unaria solo permite numeros", node.location.start.line, node.location.start.column)
        }
        const nodoN = new Numero({ valor: !exp_unica.valor })
        nodoN.location = node.location
        return nodoN;
      default:
        return new Errores("Operacion unaria no soportada", node.location.start.line, node.location.start.column)

    }
  }

  /**
    * @type {BaseVisitor['visitComparacion']}
  */
  visitComparacion(node) {
    const num_left = node.exp_left.accept(this);
    const num_right = node.exp_right.accept(this);


    // Validar si no es instancia de Errores
    if (num_left instanceof Errores) {
      return num_left
    }
    if (num_right instanceof Errores) {
      return num_right
    }

    // Validar los tipos de los operandos. 
    var mismoTipo = false;

    if (num_left instanceof Numero && num_right instanceof Numero) {
      mismoTipo = true;
    }

    if (num_left instanceof Cadena && num_right instanceof Cadena) {
      mismoTipo = true;
    }

    if (num_left instanceof Booleano && num_right instanceof Booleano) {
      mismoTipo = true;
    }

    if (num_left instanceof Char && num_right instanceof Char) {
      mismoTipo = true;
    }

    if (mismoTipo) {
      switch (node.operacion) {
        case '==':
          const nodoI = new Booleano({ valor: num_left.valor == num_right.valor })
          nodoI.location = node.location
          console.log(nodoI)
          return nodoI;
        case '!=':
          const nodoD = new Booleano({ valor: !(num_left.valor === num_right.valor) })
          nodoD.location = node.location
          return nodoD;
        default:
          return new Errores("Operacion comparativa no soportada", node.location.start.line, node.location.start.column)
      }
    } else {
      return new Errores("Tipos de datos en comparacion no soportado", node.location.start.line, node.location.start.column)
    }


  }

  /**
    * @type {BaseVisitor['visitRelacional']}
  */
  visitRelacional(node) {
    var num_left = node.exp_left.accept(this);
    var num_right = node.exp_right.accept(this);


    // Validar si no es instancia de Errores
    if (num_left instanceof Errores) {
      return num_left
    }
    if (num_right instanceof Errores) {
      return num_right
    }

    // Validar los tipos de los operandos. 
    var mismoTipo = false;

    if (num_left instanceof Numero && num_right instanceof Numero) {
      mismoTipo = true;
    }

    if (num_left instanceof Char && num_right instanceof Char) {
      num_left.valor = num_left.valor.charCodeAt(0);
      num_right.valor = num_right.valor.charCodeAt(0);
      mismoTipo = true;
    }

    if (mismoTipo) {
      switch (node.operacion) {
        case '<':
          const nodoMe = new Booleano({ valor: num_left.valor < num_right.valor })
          nodoMe.location = node.location
          return nodoMe;
        case '<=':
          const nodoMeI = new Booleano({ valor: num_left.valor <= num_right.valor })
          nodoMeI.location = node.location
          return nodoMeI;
        case '>':
          const nodoMa = new Booleano({ valor: num_left.valor > num_right.valor })
          nodoMa.location = node.location
          return nodoMa;
        case '>=':
          const nodoMaI = new Booleano({ valor: num_left.valor >= num_right.valor })
          nodoMaI.location = node.location
          return nodoMaI;
        default:
          return new Errores("Operacion relacion no soportada", node.location.start.line, node.location.start.column)
      }
    } else {
      return new Errores("Tipos de datos en relacion no soportado", node.location.start.line, node.location.start.column)
    }
  }

  /**
    * @type {BaseVisitor['visitLogico']}
  */
  visitLogico(node) {
    var num_left = node.exp_left.accept(this);
    var num_right = node.exp_right.accept(this);

    // Validar si no es instancia de Errores
    if (num_left instanceof Errores) {
      return num_left
    }
    if (num_right instanceof Errores) {
      return num_right
    }

    // Validar los tipos de los operandos. 
    var mismoTipo = false;

    if (num_left instanceof Booleano && num_right instanceof Booleano) {
      mismoTipo = true;
    }

    if (mismoTipo) {
      switch (node.operacion) {
        case '&&':
          const nodoAnd = new Booleano({ valor: num_left.valor && num_right.valor })
          nodoAnd.location = node.location
          return nodoAnd;
        case '||':
          const nodoOr = new Booleano({ valor: num_left.valor || num_right.valor })
          nodoOr.location = node.location
          return nodoOr;
        default:
          return new Errores("Operacion logica no soportada", node.location.start.line, node.location.start.column)
      }
    } else {
      return new Errores("Tipos de datos en logica no soportado", node.location.start.line, node.location.start.column)
    }
  }

  /**
    * @type {BaseVisitor['visitComparacion_Unaria']}
  */
  visitComparacion_Unaria(node) {
    throw new Error('Metodo visitComparacion_Unaria no implementado');
  }


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
    return node;
  }

  /**
    * @type {BaseVisitor['visitCadena']}
  */
  visitCadena(node) {
    return node;
  }

  /**
    * @type {BaseVisitor['visitBooleano']}
  */
  visitBooleano(node) {
    return node;
  }

  /**
    * @type {BaseVisitor['visitChar']}
  */
  visitChar(node) {
    return node;
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

    if (valor instanceof Errores) {
      return valor
    }

    this.salida += valor.valor + '\n';
  }

  /**
    * @type {BaseVisitor['visitExpresionStmt']}
  */
  visitExpresionStmt(node) {
    node.exp.accept(this);
  }

}