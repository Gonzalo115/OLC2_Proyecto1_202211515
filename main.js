const editor = document.getElementById('textAreaEditor')
const consola = document.getElementById('textAreaConsola')
const btnAnalizar = document.getElementById('analizar')

btnAnalizar.addEventListener('click', () => {
    const codigoFuente = editor.value
    console.log(codigoFuente);
})