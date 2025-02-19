export function formatearFecha(fechaISO) {
    // Convertir la cadena a un objeto de fecha
    const fecha = new Date(fechaISO);

    // Extraer el día, mes y año
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const año = fecha.getFullYear();

    // Formato dd/mm/yyyy
    return `${dia}/${mes}/${año}`;
}