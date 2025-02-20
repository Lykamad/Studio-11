export function formatearFecha(fechaISO) {
    // Convertir la cadena a un objeto de fecha
    const fecha = new Date(fechaISO);

    // Extraer el día, mes y año
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const año = fecha.getFullYear();

    // Formato dd/mm/yyyy
    return `${año}-${mes}-${dia}`;
}

export function formatDateTime(fechaISO) {
    // Convertir la cadena a un objeto de fecha
    const fecha = new Date(fechaISO);

    // Extraer el día, mes y año
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const año = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const mins = String(fecha.getMinutes()).padStart(2, '0');

    
    const result = `${año}-${mes}-${dia}T${hora}:${mins}`;
    console.log(result)
    return result
}