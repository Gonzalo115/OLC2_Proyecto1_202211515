import { Entorno } from "../utils/entorno.js";
import { Errores } from "../utils/errores.js";
import { DatoPrimitivo } from "./nodos.js";
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
        if (num_left.tipo == "int" && num_right.tipo == "int") {
          const nodoS = new DatoPrimitivo({ valor: num_left.valor + num_right.valor, tipo: "int" })
          nodoS.location = node.location
          return nodoS;
        }

        if ((num_left.tipo == "float" && num_right.tipo === "float") || (num_left.tipo == "int" && num_right.tipo == "float") || (num_left.tipo == "float" && num_right.tipo == "int")) {
          const nodoS = new DatoPrimitivo({ valor: num_left.valor + num_right.valor, tipo: "float" })
          nodoS.location = node.location
          return nodoS;
        }

        if (num_left.tipo == "string" && num_right.tipo == "string") {
          const nodoS = new DatoPrimitivo({ valor: num_left.valor + num_right.valor, tipo: "string" })
          nodoS.location = node.location
          return nodoS;
        }
        return new Errores("La suma entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
      case '-':
        if (num_left.tipo == "int" && num_right.tipo == "int") {
          const nodoR = new DatoPrimitivo({ valor: num_left.valor - num_right.valor, tipo: "int" })
          nodoR.location = node.location
          return nodoR;
        }

        if ((num_left.tipo == "float" && num_right.tipo == "float") || (num_left.tipo == "int" && num_right.tipo == "float") || (num_left.tipo == "float" && num_right.tipo == "int")) {
          const nodoR = new DatoPrimitivo({ valor: num_left.valor - num_right.valor, tipo: "float" })
          nodoR.location = node.location
          return nodoR;
        }
        return new Errores("La resta entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)

      case '*':
        if (num_left.tipo == "int" && num_right.tipo == "int") {
          const nodoM = new DatoPrimitivo({ valor: num_left.valor * num_right.valor, tipo: "int" })
          nodoM.location = node.location
          return nodoM;
        }

        if ((num_left.tipo == "float" && num_right.tipo == "float") || (num_left.tipo == "int" && num_right.tipo == "float") || (num_left.tipo == "float" && num_right.tipo == "int")) {
          const nodoM = new DatoPrimitivo({ valor: num_left.valor * num_right.valor, tipo: "float" })
          nodoM.location = node.location
          return nodoM;
        }
        return new Errores("La multiplicacion entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)

      case '/':
        if (num_right.valor == 0) {
          return new Errores("La division entre cero no esta permitida", node.location.start.line, node.location.start.column)
        }

        if (num_left.tipo == "int" && num_right.tipo == "int") {
          const nodoD = new DatoPrimitivo({ valor: Math.floor(num_left.valor / num_right.valor), tipo: "int" })
          nodoD.location = node.location
          return nodoD;
        }

        if ((num_left.tipo == "float" && num_right.tipo == "float") || (num_left.tipo == "int" && num_right.tipo == "float") || (num_left.tipo == "float" && num_right.tipo == "int")) {
          const nodoD = new DatoPrimitivo({ valor: num_left.valor / num_right.valor, tipo: "float" })
          nodoD.location = node.location
          return nodoD;
        }

        return new Errores("La division entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
      case '%':
        if (!(num_left.tipo == "int" && num_right.tipo == "int")) {
          return new Errores("El modulo entre estos tipos de datos no esta permitida", node.location.start.line, node.location.start.column)
        }
        const nodoMo = new DatoPrimitivo({ valor: num_left.valor % num_right.valor, tipo: "int" })
        nodoMo.location = node.location
        return nodoMo;
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
        if (exp_unica.tipo == "int") {
          const nodoR = new DatoPrimitivo({ valor: -exp_unica.valor, tipo: "int" })
          nodoR.location = node.location
          return nodoR;
        }
        if (exp_unica.tipo == "float") {
          const nodoR = new DatoPrimitivo({ valor: -exp_unica.valor, tipo: "float" })
          nodoR.location = node.location
          return nodoR;
        }
        return new Errores("La negacion unaria solo permite numeros", node.location.start.line, node.location.start.column)
      case '!':
        if (!(exp_unica.tipo == "boolean")) {
          return new Errores("La negacion unaria solo permite booleanos", node.location.start.line, node.location.start.column)
        }
        const nodoN = new DatoPrimitivo({ valor: !exp_unica.valor, tipo: "boolean" })
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

    if ((num_left.tipo == "int" && num_right.tipo == "int") || (num_left.tipo == "float" && num_right.tipo == "float") || (num_left.tipo == "int" && num_right.tipo == "float") || (num_left.tipo == "float" && num_right.tipo == "int")) {
      mismoTipo = true;
    }

    if (num_left.tipo == "string" && num_right.tipo == "string") {
      mismoTipo = true;
    }

    if (num_left.tipo == "boolean" && num_right.tipo == "boolean") {
      mismoTipo = true;
    }

    if (num_left.tipo == "char" && num_right.tipo == "char") {
      mismoTipo = true;
    }

    if (mismoTipo) {
      switch (node.operacion) {
        case '==':
          const nodoI = new DatoPrimitivo({ valor: num_left.valor == num_right.valor, tipo: "boolean" })
          nodoI.location = node.location
          return nodoI;
        case '!=':
          const nodoD = new DatoPrimitivo({ valor: !(num_left.valor === num_right.valor), tipo: "boolean" })
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

    if ((num_left.tipo == "int" && num_right.tipo == "int") || (num_left.tipo == "float" && num_right.tipo == "float") || (num_left.tipo == "int" && num_right.tipo == "float") || (num_left.tipo == "float" && num_right.tipo == "int")) {
      mismoTipo = true;
    }

    if (num_left.tipo == "char" && num_right.tipo == "char") {
      num_left.valor = num_left.valor.charCodeAt(0);
      num_right.valor = num_right.valor.charCodeAt(0);
      mismoTipo = true;
    }

    if (mismoTipo) {
      switch (node.operacion) {
        case '<':
          const nodoMe = new DatoPrimitivo({ valor: num_left.valor < num_right.valor, tipo: "boolean" })
          nodoMe.location = node.location
          return nodoMe;
        case '<=':
          const nodoMeI = new DatoPrimitivo({ valor: num_left.valor <= num_right.valor, tipo: "boolean" })
          nodoMeI.location = node.location
          return nodoMeI;
        case '>':
          const nodoMa = new DatoPrimitivo({ valor: num_left.valor > num_right.valor, tipo: "boolean" })
          nodoMa.location = node.location
          return nodoMa;
        case '>=':
          const nodoMaI = new DatoPrimitivo({ valor: num_left.valor >= num_right.valor, tipo: "boolean" })
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

    if (num_left.tipo == "boolean" && num_right.tipo == "boolean") {
      mismoTipo = true;
    }

    if (mismoTipo) {
      switch (node.operacion) {
        case '&&':
          const nodoAnd = new DatoPrimitivo({ valor: num_left.valor && num_right.valor, tipo: "boolean" })
          nodoAnd.location = node.location
          return nodoAnd;
        case '||':
          const nodoOr = new DatoPrimitivo({ valor: num_left.valor || num_right.valor, tipo: "boolean" })
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
    * @type {BaseVisitor['visitDatoPrimitivo']}
  */
  visitDatoPrimitivo(node) {
    return node
  }

  /**
    * @type {BaseVisitor['visitDeclaracionVariable']}
  */
  visitDeclaracionVariable(node) {
  
    const tipoVaribale = node.tipo;
    const nombreVariable = node.id;
    var valorVariable
    if (node.exp != null) {
      valorVariable = node.exp.accept(this);
    }

    if (valorVariable instanceof Errores) {
      return valorVariable
    }

    switch (tipoVaribale) {
      case 'int':

        if (!valorVariable) {
          const nodoR = new DatoPrimitivo({ valor: 0, tipo: "int" })
          nodoR.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }
        } else {
          if (!(valorVariable.tipo == "int")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, valorVariable);

          if (error instanceof Errores) {
            return error
          }
        }
        return null
      case 'float':
        if (!valorVariable) {
          const nodoR = new DatoPrimitivo({ valor: 0, tipo: "float" })
          nodoR.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }
        } else {
          if (!(valorVariable.tipo == "float")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, valorVariable);

          if (error instanceof Errores) {
            return error
          }
        }
        return null
      case 'string':
        if (!valorVariable) {
          const nodoR = new DatoPrimitivo({ valor: "", tipo: "string" })
          nodoR.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }
        } else {
          if (!(valorVariable.tipo == "string")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, valorVariable);

          if (error instanceof Errores) {
            return error
          }
        }
        return null
      case 'boolean':
        if (!valorVariable) {
          const nodoR = new DatoPrimitivo({ valor: true, tipo: "boolean" })
          nodoR.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }

        } else {
          if (!(valorVariable.tipo == "boolean")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, valorVariable);

          if (error instanceof Errores) {
            return error
          }
          return null
        }
        return null
      case 'char':
        if (!valorVariable) {
          const nodoR = new DatoPrimitivo({ valor: '', tipo: "char" })
          nodoR.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }
        } else {
          if (!(valorVariable.tipo == "char")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, valorVariable);

          if (error instanceof Errores) {
            return error
          }
        }
        return null
      case 'var':
        if (!valorVariable) {
          return new Errores("Una variable tipo var debe de estar inicializa", node.location.start.line, node.location.start.column)
        } else {
          valorVariable.location = node.location
          var error = this.entornoActual.setVariable(nombreVariable, valorVariable);
          if (error instanceof Errores) {
            return error
          }
        }
        return null
      default:
        return new Errores("Tipo de variable no identificada", node.location.start.line, node.location.start.column)
    }
  }

  /**
    * @type {BaseVisitor['visitReferenciaVariable']}
  */
  visitReferenciaVariable(node) {
    const nombreVariable = node.id;
    return this.entornoActual.getVariable(nombreVariable, node.location.start);
  }

  /**
 * @type {BaseVisitor['visitAsignacion']}
 */
  visitAsignacion(node) {
    const valor = node.asgn.accept(this);
    if (valor instanceof Errores) {
      return valor;
    }

    const err = this.entornoActual.assignVariable(node.id, valor);

    if (err instanceof Errores) {
      return err
    }

    return valor;
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
    const err = node.exp.accept(this);
    if (err instanceof Errores) {
      return err
    }
  }

}