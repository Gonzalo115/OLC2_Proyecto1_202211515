import { Entorno } from "../utils/entorno.js";
import { Errores } from "../utils/errores.js";
import { Cadena, Char, Booleano, Entero, Decimal } from "./nodos.js";
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
        if (num_left instanceof Entero && num_right instanceof Entero) {
          const nodoS = new Entero({ valor: num_left.valor + num_right.valor })
          nodoS.location = node.location
          return nodoS;
        }

        if ((num_left instanceof Entero && num_right instanceof Decimal) || (num_left instanceof Decimal && num_right instanceof Entero) || (num_left instanceof Decimal && num_right instanceof Decimal)) {
          const nodoS = new Decimal({ valor: num_left.valor + num_right.valor })
          nodoS.location = node.location
          return nodoS;
        }

        if (num_left instanceof Cadena && num_right instanceof Cadena) {
          const nodoS = new Cadena({ valor: num_left.valor + num_right.valor })
          nodoS.location = node.location
          return nodoS;
        }
        return new Errores("La suma entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
      case '-':
        if (num_left instanceof Entero && num_right instanceof Entero) {
          const nodoR = new Entero({ valor: num_left.valor - num_right.valor })
          nodoR.location = node.location
          return nodoR;
        }

        if ((num_left instanceof Entero && num_right instanceof Decimal) || (num_left instanceof Decimal && num_right instanceof Entero) || (num_left instanceof Decimal && num_right instanceof Decimal)) {
          const nodoR = new Decimal({ valor: num_left.valor - num_right.valor })
          nodoR.location = node.location
          return nodoR;
        }
        return new Errores("La resta entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)

      case '*':
        if (num_left instanceof Entero && num_right instanceof Entero) {
          const nodoM = new Entero({ valor: num_left.valor * num_right.valor })
          nodoM.location = node.location
          return nodoM;
        }

        if ((num_left instanceof Entero && num_right instanceof Decimal) || (num_left instanceof Decimal && num_right instanceof Entero) || (num_left instanceof Decimal && num_right instanceof Decimal)) {
          const nodoM = new Decimal({ valor: num_left.valor * num_right.valor })
          nodoM.location = node.location
          return nodoM;
        }
        return new Errores("La resta entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)

      case '/':
        if (num_right.valor == 0) {
          return new Errores("La division entre cero no esta permitida", node.location.start.line, node.location.start.column)
        }

        if (num_left instanceof Entero && num_right instanceof Entero) {
          const nodoD = new Entero({ valor: Math.floor(num_left.valor / num_right.valor) })
          nodoD.location = node.location
          return nodoD;
        }

        if ((num_left instanceof Entero && num_right instanceof Decimal) || (num_left instanceof Decimal && num_right instanceof Entero) || (num_left instanceof Decimal && num_right instanceof Decimal)) {
          const nodoD = new Decimal({ valor: num_left.valor / num_right.valor })
          nodoD.location = node.location
          return nodoD;
        }

        return new Errores("La division entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
      case '%':
        if (!(num_left instanceof Entero && num_right instanceof Entero)) {
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
        if (exp_unica instanceof Entero) {
          const nodoR = new Entero({ valor: -exp_unica.valor })
          nodoR.location = node.location
          return nodoR;
        }
        if (exp_unica instanceof Decimal) {
          const nodoR = new Decimal({ valor: -exp_unica.valor })
          nodoR.location = node.location
          return nodoR;
        }
        return new Errores("La negacion unaria solo permite numeros", node.location.start.line, node.location.start.column)
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

    if ((num_left instanceof Entero && num_right instanceof Decimal) || (num_left instanceof Decimal && num_right instanceof Entero) || (num_left instanceof Entero && num_right instanceof Entero) || (num_left instanceof Decimal && num_right instanceof Decimal)) {
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

    if ((num_left instanceof Entero && num_right instanceof Decimal) || (num_left instanceof Decimal && num_right instanceof Entero) || (num_left instanceof Entero && num_right instanceof Entero) || (num_left instanceof Decimal && num_right instanceof Decimal)) {
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
    * @type {BaseVisitor['visitAgrupacion']}
  */
  visitAgrupacion(node) {
    return node.exp.accept(this);
  }

  /**
    * @type {BaseVisitor['visitEntero']}
  */
  visitEntero(node) {
    return node;
  }

  /**
    * @type {BaseVisitor['visitCadena']}
  */
  visitCadena(node) {
    return node;
  }

  /**
    * @type {BaseVisitor['visitDecimal']}
  */
  visitDecimal(node) {
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