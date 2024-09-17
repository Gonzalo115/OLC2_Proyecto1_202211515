import { Entorno } from "../utils/entorno.js";
import { Invocable } from "./invocable.js";
import { FuncDcl } from "./nodos.js";
import { ReturnException } from "./transferencia.js";
import { ContinueException } from "./transferencia.js";
import { BreakException } from "./transferencia.js";
import { Errores } from "../utils/errores.js";


export class FuncionForanea extends Invocable {


    constructor(nodo, clousure) {
        super();
        /**
         * @type {FuncDcl}
         */
        this.nodo = nodo;

        /**
         * @type {Entorno}
         */
        this.clousure = clousure;
    }

    aridad(args) {

        if (this.nodo.params.length !== args.length) {
            return new Errores("La cantidad de argumentos no coicide con la cantidad de parametros necesarios", this.nodo.location.start.line, this.nodo.location.start.column)
        }

        for (let i = 0; i < this.nodo.params.length; i++) {
            const param = this.nodo.params[i];
            const arg = args[i];
            if (param.tipo !== arg.tipo) {
                return new Errores("Un argumento no coincide con el tipo de un parámetro de la función", this.nodo.location.start.line, this.nodo.location.start.column);
            }
        }
        return;
    }


    /**
    * @type {Invocable['invocar']}
    */
    invocar(interprete, args) {
        const entornoNuevo = new Entorno(this.clousure);

        for (let i = 0; i < this.nodo.params.length; i++) {
            const param = this.nodo.params[i];
            const arg = args[i];
            const err = entornoNuevo.set(param.id, args[i]);
            if (err instanceof Errores) {
                return err
            }
        }

        const entornoAntesDeLaLlamada = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;

        try {
            const err = this.nodo.bloque.accept(interprete);
            if (err instanceof Errores){
                return err
            }
        } catch (error) {
            interprete.entornoActual = entornoAntesDeLaLlamada;

            if (error instanceof ReturnException) {

                if (this.nodo.tipo === "void"){

                    if(error.value != null){
                        return new Errores("se esta tratando de devolver un valor en un metodo", this.nodo.location.start.line, this.nodo.location.start.column);
                    }
                    return null
                }

                if (this.nodo.tipo !== error.value.tipo){
                    return new Errores("se esta tratando de devolver un dato que su tipo de dato es diferente que el de la funcion", this.nodo.location.start.line, this.nodo.location.start.column);
                }

                return error.value
            }


            if (error instanceof ContinueException){
                return new Errores("hay un continuo definido fuera de una sencia de control", this.nodo.location.start.line, this.nodo.location.start.column);
            }

            if (error instanceof BreakException){
                return new Errores("hay un Break definido fuera de una sencia de control", this.nodo.location.start.line, this.nodo.location.start.column);
            }

            throw error;
        }

        interprete.entornoActual = entornoAntesDeLaLlamada;
        return null
    }

    atar(instancia) {
        const entornoOculto = new Entorno(this.clousure);
        entornoOculto.set('this', instancia);
        return new FuncionForanea(this.nodo, entornoOculto);
    }

}