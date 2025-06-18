
export default function diaDeLaSemana() {
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