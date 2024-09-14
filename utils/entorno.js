import { Errores } from "./errores.js";

export class Entorno {

    /**
        * @param {Entorno} entornoAnterior
     */
    constructor(entornoAnterior = undefined) {
        this.valores = {};
        this.entornoAnterior = entornoAnterior;
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     */
    setVariable(nombre, valor) {
        const exist = this.valores[nombre];

        if (exist) {
            return new Errores(`La variable "${nombre}" ya existe`, valor.location.start.line, valor.location.start.column)
        }

        this.valores[nombre] = valor;
    }

    /**
     * @param {string} nombre
     */
    getVariable(nombre, start) {
        const valorActual = this.valores[nombre];

        if (valorActual) return valorActual;

        if (!valorActual && this.entornoAnterior) {
            return this.entornoAnterior.getVariable(nombre, start);
        }
        return new Errores(`La variable "${nombre}" no definida `, start.line, start.column)

    }

    /**
   * @param {string} nombre
   * @param {any} valor
   */
    assignVariable(nombre, valor) {
        const valorActual = this.valores[nombre];
        if (valorActual) {
            if (this.valores[nombre].tipo != valor.tipo) {
                return new Errores(`A la variable "${nombre}" no se le puede asinar otro tipo de dato que no sea ${this.valores[nombre].tipo}`, valor.location.start.line, valor.location.start.column)
            }

            this.valores[nombre] = valor;
            return;
        }

        if (!valorActual && this.entornoAnterior) {
            this.entornoAnterior.assignVariable(nombre, valor);
            return;
        }
        return new Errores(`La variable "${nombre}" no definida `, valor.location.start.line, valor.location.start.column)
    }


    incrementoVariable(nombre, valor) {
        const valorActual = this.valores[nombre];
        if (valorActual) {
            if (this.valores[nombre].tipo == "int") {
                if (valor.tipo == "int") {
                    valorActual.valor = valorActual.valor + valor.valor
                    return this.valores[nombre] = valorActual
                }
                return new Errores(`A la variable "${nombre}" no se le puede incrementar con un valor ${valor.tipo}`, valor.location.start.line, valor.location.start.column)

            }
            if (this.valores[nombre].tipo == "float") {
                if (valor.tipo == "int" || valor.tipo == "float") {
                    valorActual.valor = valorActual.valor + valor.valor
                    return this.valores[nombre] = valorActual
                }
                return new Errores(`A la variable "${nombre}" no se le puede incrementar con un valor ${valor.tipo}`, valor.location.start.line, valor.location.start.column)
            }
            if (this.valores[nombre].tipo == "string") {
                if (valor.tipo == "string") {
                    valorActual.valor = valorActual.valor + valor.valor
                    return this.valores[nombre] = valorActual
                }
                return new Errores(`A la variable "${nombre}" no se le puede incrementar con un valor ${valor.tipo}`, valor.location.start.line, valor.location.start.column)
            }

            return new Errores(`A la variable "${nombre}" no se le puede incrementar`, valor.location.start.line, valor.location.start.column)

        }

        if (!valorActual && this.entornoAnterior) {
            this.entornoAnterior.assignVariable(nombre, valor);
            return;
        }
        return new Errores(`La variable "${nombre}" no definida `, valor.location.start.line, valor.location.start.column)
    }

    decrementoVariable(nombre, valor) {
        const valorActual = this.valores[nombre];
        if (valorActual) {
            if (this.valores[nombre].tipo == "int") {
                if (valor.tipo == "int") {
                    valorActual.valor = valorActual.valor - valor.valor
                    return this.valores[nombre] = valorActual
                }
                return new Errores(`A la variable "${nombre}" no se le puede incrementar con un valor ${valor.tipo}`, valor.location.start.line, valor.location.start.column)

            }
            if (this.valores[nombre].tipo == "float") {
                if (valor.tipo == "int" || valor.tipo == "float") {
                    valorActual.valor = valorActual.valor - valor.valor
                    return this.valores[nombre] = valorActual
                }
                return new Errores(`A la variable "${nombre}" no se le puede incrementar con un valor ${valor.tipo}`, valor.location.start.line, valor.location.start.column)
            }

            return new Errores(`A la variable "${nombre}" no se le puede incrementar`, valor.location.start.line, valor.location.start.column)

        }

        if (!valorActual && this.entornoAnterior) {
            this.entornoAnterior.assignVariable(nombre, valor);
            return;
        }
        return new Errores(`La variable "${nombre}" no definida `, valor.location.start.line, valor.location.start.column)
    }
}