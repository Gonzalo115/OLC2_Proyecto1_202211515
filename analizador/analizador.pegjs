
{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'aritmetica':           nodos.Aritmetica,
      'OperacionU':           nodos.Operacion_Unaria,
      'comparacion':          nodos.Comparacion,
      'relacion':             nodos.Relacional,
      'logico':               nodos.Logico,
      'agrupacion':           nodos.Agrupacion,
      'dato':                 nodos.DatoPrimitivo,
      'declaracionVariable':  nodos.DeclaracionVariable,
      'referenciaVariable':   nodos.ReferenciaVariable,
      'asignacion':           nodos.Asignacion,
      'println':              nodos.Println,
      'expresionStmt':        nodos.ExpresionStmt,
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
  }
}

programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = _ dcl:DeclaracionVar _ { return dcl }
            / _ stmt:Stmt _ { return stmt }

DeclaracionVar =  tipo:Tipo _ id:Identificador
                exp:(
                  _"=" _ exp:Expresion _  { return exp } 
                )? ";" { return crearNodo('declaracionVariable', { tipo, id, exp }) } 
                
Stmt = "System.out.println" _ "(" _ exp:Expresion _ ")" _ ";" { return crearNodo('println', { exp }) }
    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('asignacion', { id, asgn }) }
          / Or

Or = exp_left:And expansion:(
  _ operacion:("||") _ exp_right:And { return { tipo: operacion, exp_right } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, exp_right } = operacionActual
      return crearNodo('logico', { operacion:tipo, exp_left: operacionAnterior, exp_right })
    },
    exp_left
  )
}

And = exp_left:Comparacion expansion:(
  _ operacion:("&&") _ exp_right:Comparacion { return { tipo: operacion, exp_right } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, exp_right } = operacionActual
      return crearNodo('logico', { operacion:tipo, exp_left: operacionAnterior, exp_right })
    },
    exp_left
  )
}

Comparacion = exp_left:Relacional expansion:(
  _ operacion:("==" / "!=") _ exp_right:Relacional { return { tipo: operacion, exp_right } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, exp_right } = operacionActual
      return crearNodo('comparacion', { operacion:tipo, exp_left: operacionAnterior, exp_right })
    },
    exp_left
  )
}

Relacional = exp_left:Suma expansion:(
  _ operacion:("<="/">="/">"/"<") _ exp_right:Suma { return { tipo: operacion, exp_right } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, exp_right } = operacionActual
      return crearNodo('relacion', { operacion:tipo, exp_left: operacionAnterior, exp_right })
    },
    exp_left
  )
}

Suma = exp_left:Multiplicacion expansion:(
  _ operacion:("+" / "-") _ exp_right:Multiplicacion { return { tipo: operacion, exp_right } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, exp_right } = operacionActual
      return crearNodo('aritmetica', { operacion:tipo, exp_left: operacionAnterior, exp_right })
    },
    exp_left
  )
}

Multiplicacion = exp_left:Unaria expansion:(
  _ operacion:("*" / "/"/ "%") _ exp_right:Unaria { return { tipo: operacion, exp_right } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, exp_right } = operacionActual
        return crearNodo('aritmetica', { operacion:tipo, exp_left: operacionAnterior, exp_right })
      },
      exp_left
    )
}

Unaria =_ operacion:("-" / "!") _ num:Nativo _ { return crearNodo('OperacionU', { operacion: operacion, exp_unica: num }) }
      / Nativo

Nativo = [0-9]+("." [0-9]+)                           { return crearNodo('dato', { valor: parseFloat(text()), tipo: "float"}) }
      /[0-9]+                                         { return crearNodo('dato', { valor: parseInt(text(), 10), tipo: "int"}) } 
      /("true"/"false")                               { return crearNodo('dato',    { valor: text() === "true", tipo:"boolean"})}
      /'"' chars:( [^\\"\n\r] / escapeSequence)* '"'  { return crearNodo('dato',  { valor: chars.join(''), tipo: "string"});}
      /"'" chars:[\x00-\uffff] "'"                    { return crearNodo('dato',    { valor: chars, tipo: "char"}); }
      / "(" _ exp:Expresion _ ")"                     { return crearNodo('agrupacion', { exp }) }
      / id:Identificador                              { return crearNodo('referenciaVariable',  { id }) }



// Secuencias de escape
escapeSequence=  '\\"'  { return '"'; }       // Comilla doble escapada
    / "\\\\" { return "\\"; }      // Barra invertida escapada
    / "\\n"  { return "\n"; }      // Salto de línea
    / "\\r"  { return "\r"; }      // Retorno de carro
    / "\\t"  { return "\t"; }      // Tabulación


// Tipos de datos
Tipo  = "int"     { return text(); }
      / "float"   { return text(); }
      / "string"  { return text(); }
      / "boolean" { return text(); }
      / "char"    { return text(); }
      / "var"     { return text(); }

// Identificador
Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

_ = [ \t\n\r]*