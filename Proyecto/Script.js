const readlineSync = require('readline-sync');


class Empleado {
    constructor(nombre, sexo, extranjero, vuelos, zonaRural, estrato, hijos, sueldo) {
        this.nombre = nombre;
        this.sexo = sexo;
        this.extranjero = extranjero;
        this.vuelos = vuelos;
        this.zonaRural = zonaRural;
        this.estrato = estrato;
        this.hijos = hijos;
        this.sueldo = sueldo;
    }
}


class NodoEmpleado {
    constructor(empleado) {
        this.valor = empleado;
        this.siguiente = null;
    }
}


class ListaEmpleados {
    constructor() {
        this.cabeza = null;
        this.cantEmpleadosIngresados = 0;
        this.totalNomina = 0;
        this.costoHombres = 0;
        this.costoMujeres = 0;
        this.empleadoMasCostoso = null;
        this.costoPasajesExtranjeros = 0;
        this.totalSubsidioPrimaria = 0;
        this.totalSubsidioSecundaria = 0;
        this.totalSubsidioUniversidad = 0;
        this.contadorExtranjeros = 0;
        this.contadorPersonasGeneroF = 0;
        this.contadorPersonasGeneroM = 0;
        this.contadorSubPrim = 0;
        this.contadorSubSec = 0;
        this.contadorSubUni = 0;
        this.subPrimaria = 0;
        this.subSecundaria = 0;
        this.subUniversidad = 0;
    }

    insertar(empleado) {
        const nuevoNodo = new NodoEmpleado(empleado);
        if (this.cabeza == null) {
            this.cabeza = nuevoNodo;
        } else {
            let nodoTmp = this.cabeza;
            while (nodoTmp.siguiente != null) {
                nodoTmp = nodoTmp.siguiente;
            }
            nodoTmp.siguiente = nuevoNodo;
        }
        this.cantEmpleadosIngresados++;
    }

    ingresarSubsidioHijos() {
        this.subPrimaria = +readlineSync.question('Ingrese el valor del subsidio para hijos en primaria: ');
        this.subSecundaria = +readlineSync.question('Ingrese el valor del subsidio para hijos en secundaria: ');
        this.subUniversidad = +readlineSync.question('Ingrese el valor del subsidio para hijos en universidad: ');
    }

    calcularCostos() {
        let nodoTmp = this.cabeza;
        while (nodoTmp != null) {
            let empleado = nodoTmp.valor;
            let totalSubsidiosHijos = 0;
            empleado.hijos.forEach(hijo => {
                switch (hijo) {
                    case 'Primaria':
                        this.contadorSubPrim++;
                        totalSubsidiosHijos += this.subPrimaria;
                        break;
                    case 'Secundaria':
                        this.contadorSubSec++;
                        totalSubsidiosHijos += this.subSecundaria;
                        break;
                    case 'Universidad':
                        this.contadorSubUni++;
                        totalSubsidiosHijos += this.subUniversidad;
                        break;
                }
            });

            let subsidioEstrato = 0;
            switch (empleado.estrato) {
                case 1:
                    subsidioEstrato = empleado.sueldo * 0.15;
                    break;
                case 2:
                    subsidioEstrato = empleado.sueldo * 0.10;
                    break;
                case 3:
                    subsidioEstrato = empleado.sueldo * 0.05;
                    break;
                default:
                    subsidioEstrato = 0;
                    break;
            }

            let subsidioRural = empleado.zonaRural ? 35000 : 0;
            let costoTotalEmpleado = empleado.sueldo + subsidioEstrato + subsidioRural + totalSubsidiosHijos;

            if (empleado.extranjero) {
                costoTotalEmpleado += empleado.vuelos.reduce((a, b) => a + b, 0);
                this.costoPasajesExtranjeros += empleado.vuelos.reduce((a, b) => a + b, 0);
            }

            this.totalNomina += costoTotalEmpleado;

            if (empleado.sexo.toLowerCase() === 'f') {
                this.costoMujeres += costoTotalEmpleado;
                this.contadorPersonasGeneroF++;
            } else {
                this.costoHombres += costoTotalEmpleado;
                this.contadorPersonasGeneroM++;
            }

            if (this.empleadoMasCostoso === null || costoTotalEmpleado > this.empleadoMasCostoso.costo) {
                this.empleadoMasCostoso = {
                    nombre: empleado.nombre,
                    costo: costoTotalEmpleado
                };
            }

            nodoTmp = nodoTmp.siguiente;
        }

        this.totalSubsidioPrimaria = this.contadorSubPrim * this.subPrimaria;
        this.totalSubsidioSecundaria = this.contadorSubSec * this.subSecundaria;
        this.totalSubsidioUniversidad = this.contadorSubUni * this.subUniversidad;
    }

    mostrarResultados() {
        console.log('Costo total de la nómina:', this.totalNomina);
        console.log('Costo de la nómina de hombres:', this.costoHombres);
        console.log('Costo de la nómina de mujeres:', this.costoMujeres);
        console.log('Empleado más costoso:', this.empleadoMasCostoso.nombre, 'con un costo de:', this.empleadoMasCostoso.costo);
        console.log('Costo total de subsidios para hijos en primaria:', this.totalSubsidioPrimaria);
        console.log('Costo total de subsidios para hijos en secundaria:', this.totalSubsidioSecundaria);
        console.log('Costo total de subsidios para hijos en universidad:', this.totalSubsidioUniversidad);
        console.log('Costo total de pasajes para empleados extranjeros:', this.costoPasajesExtranjeros);
    }
}

const listaEmpleados = new ListaEmpleados();


listaEmpleados.ingresarSubsidioHijos();


let cantEmpleados = +readlineSync.question('Ingrese la cantidad de empleados: ');
if (isNaN(cantEmpleados) || cantEmpleados <= 0) {
    console.error('La cantidad de empleados debe ser un valor numérico mayor que 0');
} else {
    for (let i = 0; i < cantEmpleados; i++) {
        console.info(`Cantidad de empleados ingresados: ${i + 1} de ${cantEmpleados}`);
        const nombre = readlineSync.question('Ingrese el nombre del empleado: ');
        const sexo = readlineSync.question('Ingrese el sexo del empleado (F/M): ');
        if (sexo.toLowerCase() !== 'f' && sexo.toLowerCase() !== 'm') {
            console.error('Sexo no válido. Debe ser F o M.');
            i--;
            continue;
        }

        const extranjero = readlineSync.keyInYNStrict('¿Es extranjero? ingrese "Y" para si o "N" para no: ');
        let vuelos = [];
        if (extranjero) {
            const vuelo1 = +readlineSync.question('Ingrese el valor del primer vuelo: ');
            const vuelo2 = +readlineSync.question('Ingrese el valor del segundo vuelo: ');
            vuelos = [vuelo1, vuelo2];
        }

        const zonaRural = readlineSync.keyInYNStrict('¿Vive en zona rural? ingrese "Y" para si o "N" para no: ');

        const estrato = +readlineSync.question('Ingrese el estrato del empleado: ');

        const tieneHijos = readlineSync.keyInYNStrict('¿Tiene hijos? ingrese "Y" para si o "N" para no: ');
        let hijos = [];
        if (tieneHijos) {
            const cantidadHijos = +readlineSync.question('Ingrese la cantidad de hijos: ');
            for (let j = 0; j < cantidadHijos; j++) {
                const tipoEducacion = readlineSync.keyInSelect(['Primaria', 'Secundaria', 'Universidad'], `Seleccione el tipo de educación para el hijo ${j + 1}:`);
                if (tipoEducacion === -1) {
                    console.error('Opción no válida.');
                    j--;
                } else {
                    hijos.push(['Primaria', 'Secundaria', 'Universidad'][tipoEducacion]);
                }
            }
        }

        const sueldo = +readlineSync.question('Ingrese el sueldo del empleado: ');

        const empleado = new Empleado(nombre, sexo, extranjero, vuelos, zonaRural, estrato, hijos, sueldo);
        listaEmpleados.insertar(empleado);
    }

    listaEmpleados.calcularCostos();
    listaEmpleados.mostrarResultados();
}
