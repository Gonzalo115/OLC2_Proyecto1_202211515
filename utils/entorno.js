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

        if (exist){
            return new Errores(`La variable "${nombre}" ya existe`, valor.location.start.line , valor.location.start.column)
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
        return new Errores(`La variable "${nombre}" no existe `, start.line, start.column)

    }

    /**
   * @param {string} nombre
   * @param {any} valor
   */
    assignVariable(nombre, valor) {
        const valorActual = this.valores[nombre];
        if (valorActual) {
            this.valores[nombre] = valor;
            return;
        }

        if (!valorActual && this.entornoAnterior) {
            this.entornoAnterior.assignVariable(nombre, valor);
            return;
        }
        console.log(valor)
        return new Errores(`La variable "${nombre}" no definida `, valor.location.start.line, valor.location.start.column)
    }
}