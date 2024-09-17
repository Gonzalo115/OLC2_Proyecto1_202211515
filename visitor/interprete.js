import { Entorno } from "../utils/entorno.js";
import { Errores } from "../utils/errores.js";
import { DatoPrimitivo } from "./nodos.js";
import { BaseVisitor } from "./visitor.js";
import nodos, { Expresion } from './nodos.js'
import { Invocable } from "./invocable.js";
import { embebidas } from "./embebidas.js";
import { FuncionForanea } from "./foreanea.js";
import { BreakException, ContinueException, ReturnException } from "./transferencia.js";



export class InterpreterVisitor extends BaseVisitor {

  constructor() {
    super();
    this.entornoActual = new Entorno();

    // funciones embebidas
    Object.entries(embebidas).forEach(([nombre, funcion]) => {
      this.entornoActual.set(nombre, funcion);
    });

    this.salida = '';
    /**
     * @type {Expresion | null}
    */
    this.prevContinue = null;
  }

  interpretar(nodo) {
    return nodo.accept(this);
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
    const res = node.exp.accept(this);
    if (res instanceof Errores) {
      return res
    }
    return res
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
          var error = this.entornoActual.set(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }
        } else {
          if (!(valorVariable.tipo == "int")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.set(nombreVariable, valorVariable);

          if (error instanceof Errores) {
            return error
          }
        }
        return null
      case 'float':
        if (!valorVariable) {
          const nodoR = new DatoPrimitivo({ valor: 0, tipo: "float" })
          nodoR.location = node.location
          var error = this.entornoActual.set(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }
        } else {
          if (!(valorVariable.tipo == "float")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.set(nombreVariable, valorVariable);

          if (error instanceof Errores) {
            return error
          }
        }
        return null
      case 'string':
        if (!valorVariable) {
          const nodoR = new DatoPrimitivo({ valor: "", tipo: "string" })
          nodoR.location = node.location
          var error = this.entornoActual.set(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }
        } else {
          if (!(valorVariable.tipo == "string")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.set(nombreVariable, valorVariable);

          if (error instanceof Errores) {
            return error
          }
        }
        return null
      case 'boolean':
        if (!valorVariable) {
          const nodoR = new DatoPrimitivo({ valor: true, tipo: "boolean" })
          nodoR.location = node.location
          var error = this.entornoActual.set(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }

        } else {
          if (!(valorVariable.tipo == "boolean")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.set(nombreVariable, valorVariable);

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
          var error = this.entornoActual.set(nombreVariable, nodoR);

          if (error instanceof Errores) {
            return error
          }
        } else {
          if (!(valorVariable.tipo == "char")) {
            return new Errores("El tipo de la varibale y de la expresion no son la misma", node.location.start.line, node.location.start.column)
          }
          valorVariable.location = node.location
          var error = this.entornoActual.set(nombreVariable, valorVariable);

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
          var error = this.entornoActual.set(nombreVariable, valorVariable);
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
    const res = this.entornoActual.get(nombreVariable, node.location.start);
    if (res instanceof Errores) {
      return res
    }
    return res
  }

  /**
 * @type {BaseVisitor['visitAsignacion']}
 */
  visitAsignacion(node) {
    const valor = node.asgn.accept(this);
    if (valor instanceof Errores) {
      return valor;
    }

    const err = this.entornoActual.assign(node.id, valor);

    if (err instanceof Errores) {
      return err
    }

    return valor;
  }

  /**
 * @type {BaseVisitor['visitIncremento']}
 */
  visitIncremento(node) {
    const valor = node.valor.accept(this);
    if (valor instanceof Errores) {
      return valor;
    }

    const err = this.entornoActual.incremento(node.id, valor);

    if (err instanceof Errores) {
      return err
    }

    return valor;
  }

  /**
 * @type {BaseVisitor['visitDecremento']}
 */
  visitDecremento(node) {
    const valor = node.valor.accept(this);
    if (valor instanceof Errores) {
      return valor;
    }

    const err = this.entornoActual.decremento(node.id, valor);

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
    * @type {BaseVisitor['visitPrintln']}
  */

  visitExpresionPrintln(node) {
    const num_left = node.exp_left.accept(this);
    const num_right = node.exp_right.accept(this);

    if (num_left instanceof Errores) {
      return num_left
    }
    if (num_right instanceof Errores) {
      return num_right
    }

    const nodoS = new DatoPrimitivo({ valor: String(num_left.valor) + String(num_right.valor), tipo: "string" })
    nodoS.location = node.location
    return nodoS;
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

  /**
 * @type {BaseVisitor['visitBloque']}
 */
  visitBloque(node) {
    const entornoAnterior = this.entornoActual;
    this.entornoActual = new Entorno(entornoAnterior);

    for (let i = 0; i < node.dcls.length; i++) {
      var res = node.dcls[i].accept(this);
      if (res instanceof Errores) {
        this.entornoActual = entornoAnterior;
        return res
      }
    }
    this.entornoActual = entornoAnterior;
    return
  }

  /**
   * @type {BaseVisitor['visitTernario']}
   */
  visitTernario(node) {
    const cond = node.cond.accept(this)
    if (cond instanceof Errores) {
      return cond
    }

    if (!(cond instanceof DatoPrimitivo) && cond.tipo != "boolean") {
      return new Errores("La condicion del ", node.location.start.line, node.location.start.column)
    }

    if (cond.dato == "true") {
      const expTrue = node.expTrue.accept(this)
      if (expTrue instanceof Errores) {
        return expTrue
      }
      return expTrue
    } else {
      const expFalse = node.expFalse.accept(this)
      if (expFalse instanceof Errores) {
        return expFalse
      }
      return expFalse
    }
  }

  /**
   * @type {BaseVisitor['visitIf']}
   */
  visitIf(node) {
    const cond = node.cond.accept(this);
    if (cond.tipo != "boolean") {
      return new Errores("La condicion del if no es un booleano", node.location.start.line, node.location.start.column)

    }

    if (cond.valor) {
      var res = node.stmtTrue.accept(this);
      if (res instanceof Errores) {
        return res;
      }
      return;
    }

    if (node.stmtFalse) {
      var res = node.stmtFalse.accept(this);
      if (res instanceof Errores) {
        return res;
      }
    }

  }

  /**
   * @type {BaseVisitor['visitSwitch']}
   */
  visitSwitch(node) {
    const cond = node.exp.accept(this)

    if (cond instanceof Errores) {
      return cond;
    }

    try {
      for (let i = 0; i < node.casos.length; i++) {
        if (cond.valor === node.casos[i].exp.accept(this).valor) {
          var err = node.casos[i].accept(this);
          if (err instanceof Errores) {
            return err
          }
        }
      }

      if (node.stmtDefault) {
        var res = node.stmtDefault.accept(this);
        if (res instanceof Errores) {
          return res;
        }
      }
    } catch (error) {

      if (error instanceof BreakException) {
        return
      }

      throw error;

    }

  }

  /**
   * @type {BaseVisitor['visitCaso']}
   */
  visitCaso(node) {
    const err = node.stmt.accept(this)
    if (err instanceof Errores) {
      return err
    }
  }

  /**
   * @type {BaseVisitor['visitWhile']}
   */
  visitWhile(node) {
    const cond = node.cond.accept(this);

    if (cond instanceof Errores) {
      return cond;
    }

    if (cond.tipo != "boolean") {
      return new Errores("La condicion del while no es un booleano", node.location.start.line, node.location.start.column)
    }

    const entornoConElQueEmpezo = this.entornoActual;
    try {
      while (node.cond.accept(this).valor) {
        const res = node.stmt.accept(this);
        if (res instanceof Errores) {
          this.entornoActual = entornoConElQueEmpezo
          return res;
        }
      }
    } catch (error) {
      this.entornoActual = entornoConElQueEmpezo;

      if (error instanceof BreakException) {
        return
      }

      if (error instanceof ContinueException) {
        return this.visitWhile(node);
      }

      throw error;

    }
  }

  /**
   * @type {BaseVisitor['visitFor']}
   */
  visitFor(node) {
    // this.prevContinue = node.inc;
    const incrementoAnterior = this.prevContinue;
    this.prevContinue = node.inc;

    const forTraducido = new nodos.Bloque({
      dcls: [
        node.init,
        new nodos.While({
          cond: node.cond,
          stmt: new nodos.Bloque({
            dcls: [
              node.stmt,
              node.inc
            ]
          })
        })
      ]
    })

    forTraducido.accept(this);

    this.prevContinue = incrementoAnterior;
  }

  /**
   * @type {BaseVisitor['visitBreak']}
   */
  visitBreak(node) {
    throw new BreakException();
  }

  /**
   * @type {BaseVisitor['visitContinue']}
   */
  visitContinue(node) {
    if (this.prevContinue) {
      this.prevContinue.accept(this);
    }

    throw new ContinueException();
  }


  /**
   * @type {BaseVisitor['visitReturn']}
   */
  visitReturn(node) {
    let valor = null
    if (node.exp) {
      valor = node.exp.accept(this);
    }
    throw new ReturnException(valor);
  }

  /**
  * @type {BaseVisitor['visitLlamada']}
  */
  visitLlamada(node) {
    const funcion = node.callee.accept(this);
    const argumentos = [];
    for (let i = 0; i < node.args.length; i++) {
      const arg = node.args[i].accept(this);

      if (arg instanceof Errores){
        return arg
      }

      argumentos.push(arg);
    }

    if (!(funcion instanceof Invocable)) {
      return new Errores("La llamada No es invocable", node.location.start.line, node.location.start.column)
    }

    const err = funcion.aridad(argumentos)
    if (err instanceof Errores) {
      return err
    }


    const res = funcion.invocar(this, argumentos);

    if (res instanceof Errores) {
      return res
    }

    return res
  }

  /**
  * @type {BaseVisitor['visitFuncDcl']}
  */
  visitFuncDcl(node) {
    const funcion = new FuncionForanea(node, this.entornoActual);
    this.entornoActual.set(node.id, funcion);
  }

  /**
  * @type {BaseVisitor['visitParametro']}
  */
  visitParametro(node) {
    throw node
  }


}