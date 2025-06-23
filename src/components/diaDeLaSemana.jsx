
export const diaDeLaSemana = () => {
            const dato = new Date();
            // const segundo = dato.getSeconds();
            // const minuto = dato.getMinutes();
            // const hora = dato.getHours();
            const mes = dato.getMonth();
            const anio = dato.getFullYear();
            const nro = dato.getDate();
            const dia = dato.getDay();
            let diasDeLaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            let diaSemanal = `${diasDeLaSemana[dia]} ${nro} de ${meses[mes]} del ${anio}`;
            return diaSemanal
}

export const obtenerFechaDesdeObjectId = (objectId) => {
  // Los primeros 8 caracteres del ObjectId representan la fecha en segundos desde el Unix epoch
  const timestampHex = objectId.toString().substring(0, 8);
  const timestamp = parseInt(timestampHex, 16); // Convierte hex a decimal
  const fecha = new Date(timestamp * 1000); // Convierte a milisegundos
  return fecha;
}
