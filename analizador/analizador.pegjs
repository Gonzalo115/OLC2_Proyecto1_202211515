
{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'aritmetica':           nodos.Aritmetica,
      'aritmeticaU':          nodos.Aritmetica_Unaria,
      'agrupacion':           nodos.Agrupacion,
      'numero':               nodos.Numero,
      'cadena':               nodos.Cadena,
      'bool':                 nodos.Booleano,
      'char':                 nodos.Char,
      'declaracionVariable':  nodos.DeclaracionVariable,
      'referenciaVariable':   nodos.ReferenciaVariable,
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

DeclaracionVar = tipo:Tipo _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('declaracionVariable', { id, exp }) }  
               // tipo:Tipo _ id:Identificador _  ";"                      { return crearNodo('declaracionVariable', { id, exp:null }) } 

Stmt = "System.out.println" _ "(" _ exp:Expresion _ ")" _ ";" { return crearNodo('println', { exp }) }
    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

Expresion = Suma

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
  _ operacion:("*" / "/") _ exp_right:Unaria { return { tipo: operacion, exp_right } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, exp_right } = operacionActual
        return crearNodo('aritmetica', { operacion:tipo, exp_left: operacionAnterior, exp_right })
      },
      exp_left
    )
}

Unaria = "-" _ num:Nativo _ { return crearNodo('aritmeticaU', { operacion: '-', exp_unica: num }) }
      / Nativo

Nativo = [0-9]+( "." [0-9]+ )?                    { return crearNodo('numero',  { valor: parseFloat(text(), 10) })}
  /("true"/"false")                               { return crearNodo('bool',    { valor: text() === "true" })}
  /'"' chars:( [^\\"\n\r] / escapeSequence)* '"'  { return crearNodo('cadena',  { valor: chars.join('')});}
  /"'" chars:[\x00-\uffff] "'"                        { return crearNodo('char',    { valor: chars }); }
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