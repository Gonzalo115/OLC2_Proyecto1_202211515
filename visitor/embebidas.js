import { Invocable } from "./invocable.js";
import { DatoPrimitivo } from "./nodos.js";


class FuncionNativa extends Invocable {
    constructor(aridad, func) {
        super();
        this.aridad = aridad;
        this.invocar = func;
    }
}


export const embebidas = {
    'time': new FuncionNativa(() => 0, () => new DatoPrimitivo({ valor: new Date().toISOString(), tipo: "string" }))
}