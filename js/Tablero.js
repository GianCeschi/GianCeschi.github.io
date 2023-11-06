class Tablero {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.celdas = [];
    this.tableroWidth = 500; // Ancho deseado del tablero
    this.tableroHeight = 500; // Alto deseado del tablero  ESTO PARA DARLE UN TAMAÑO AL TABLERO QUE NO SEA DE TODO EL CANVAS
    this.filas = 6;
    this.columnas = 7;
    this.anchoCelda = this.tableroWidth / this.columnas;
    this.altoCelda = this.tableroHeight / this.filas;
    this.jugadorActual = 1;
    this.imgJ1 =
    this.FICHASINICIALES = this.columnas * this.filas / 2; //PARA CADA JUGADOR
    this.fichasJugador1 = [];  //this.columnas * this.filas / 2; //PARA CADA JUGADOR
    this.fichasJugador2 = [];
    this.fichaSeleccionada = null;
    //prueba

    this.inicializarTablero();
    this.dibujarTablero();
  }

  inicializarTablero() {
    for (let fila = 0; fila < this.filas; fila++) {
      this.celdas[fila] = [];
      for (let col = 0; col < this.columnas; col++) {
        this.celdas[fila][col] = 0;
        //console.log(this.celdas);
      }
    }
  }

  dibujarTablero() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


    for (let fila = 0; fila < this.filas; fila++) {
      for (let col = 0; col < this.columnas; col++) {
        const x = col * this.anchoCelda;
        const y = fila * this.altoCelda;
        this.ctx.fillStyle = 'gray';    //ESTO ES PARA QUE SE DIBUJEN LOS CIRCULOS DEL TABLERO
        this.ctx.beginPath();
        this.ctx.arc(x + this.anchoCelda / 2, y + this.altoCelda / 2, 30, 0, Math.PI * 2);
        this.ctx.fill();
        if (this.celdas[fila][col] === 1) {
          this.ficha = new Ficha(this.ctx, x + this.anchoCelda / 2, y + this.altoCelda / 2, 30, 'img/fichaIronMan.png');
          this.ficha.dibujar();
        } else if (this.celdas[fila][col] === 2) {
          this.ficha = new Ficha(this.ctx, x + this.anchoCelda / 2, y + this.altoCelda / 2, 30, 'img/fichaLoki.jpg');
          this.ficha.dibujar();
        }

        this.ctx.strokeStyle = "#f34545"; //COLOR DE LAS LINEAS DEL TABLERO
        this.ctx.strokeRect(x, y, this.anchoCelda, this.altoCelda);
      }
    }
  }


  //INICIALIZAMOS LA FICHA PARA EL JUGADOR SELECCIONAR
  inicializarFicha() {
    // Declarar un arreglo para almacenar las fichas
    this.fichas = [];

    // Definir la cantidad de fichas que deseas crear
    const numFichas = this.FICHASINICIALES; // Cambia este valor según la cantidad deseada

    const espaciado = 10;
    const tamano = 30; // Tamaño de cada ficha
    const imagenSrc = 'img/fichaIronMan.png'; // Ruta de la imagen

    for (let i = 0; i < numFichas; i++) {
      // Calcular la posición y otros atributos para cada ficha
      const x = this.canvas.width - 50;
      const y = 40 + i * espaciado; // Espaciado mínimo entre las fichas (altura de la ficha)

      // Crear una instancia de Ficha y agregarla al arreglo
      const ficha = new Ficha(this.ctx, x, y, tamano, imagenSrc);
      this.fichas.push(ficha);

      // Dibujar la ficha recién creada
      ficha.dibujar();
    }


    // Declarar una variable para almacenar la ficha seleccionada
    let fichaSeleccionada = null;

    this.canvas.addEventListener('mousedown', (event) => {
      const x = event.offsetX;
      const y = event.offsetY;

      // Verificar si se hizo clic en alguna ficha
      for (const ficha of this.fichas) {
        if (ficha.verificarClic(x, y)) {
          fichaSeleccionada = ficha;
          // Calcular el offset para evitar que la ficha salte al hacer clic
          this.offsetX = x - ficha.x;
          this.offsetY = y - ficha.y;
        }
      }
    });

    this.canvas.addEventListener('mousemove', (event) => {
      if (fichaSeleccionada) {
        const x = event.offsetX;
        const y = event.offsetY;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dibujarTablero();

        // Mover la ficha seleccionada
        fichaSeleccionada.x = x - this.offsetX;
        fichaSeleccionada.y = y - this.offsetY;

        // Dibujar todas las fichas nuevamente
        for (const ficha of this.fichas) {
          ficha.dibujar();
        }
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      if (fichaSeleccionada) {
        fichaSeleccionada = null;

        // Verificar si se soltó en la zona del tablero y realizar la jugada.
        const col = Math.floor(fichaSeleccionada.x / this.anchoCelda);
        
        // this.jugar(col);
        verificarGanador(this);
      }
    });
  }


  jugar(col) {
    for (let fila = this.filas - 1; fila >= 0; fila--) {
      if (this.celdas[fila][col] === 0) {
        this.celdas[fila][col] = this.jugadorActual;
        this.dibujarTablero();

        // Aquí puedes agregar la lógica para verificar si hay un ganador o empate.
        // Por ejemplo, puedes implementar una función que revise si hay 4 fichas del mismo jugador en fila, columna o diagonal.

        this.jugadorActual = this.jugadorActual === 1 ? 2 : 1; // Alternar entre jugadores.
        break;
      }
    }
  }
}

const tablero = new Tablero();

tablero.inicializarFicha(); // Inicializa la ficha arrastrable

// Puedes agregar eventos de clic para permitir que los jugadores seleccionen una columna para jugar.
// Por ejemplo:
tablero.canvas.addEventListener('click', (event) => {
  const col = Math.floor(event.offsetX / tablero.anchoCelda);
  tablero.jugar(col);
  // Después de que un jugador ha jugado, verifica si hay un ganador.
  verificarGanador(tablero);
});

function verificarGanadorVertical(tablero, jugador) {
  for (let col = 0; col < tablero.columnas; col++) {
    for (let fila = 0; fila <= tablero.filas - 4; fila++) {
      if (
        tablero.celdas[fila][col] === jugador &&
        tablero.celdas[fila + 1][col] === jugador &&
        tablero.celdas[fila + 2][col] === jugador &&
        tablero.celdas[fila + 3][col] === jugador
      ) {
        return true;
      }
    }
  }
  return false;
}

function verificarGanadorHorizontal(tablero, jugador) {
  for (let fila = 0; fila < tablero.filas; fila++) {
    for (let col = 0; col <= tablero.columnas - 4; col++) {
      if (
        tablero.celdas[fila][col] === jugador &&
        tablero.celdas[fila][col + 1] === jugador &&
        tablero.celdas[fila][col + 2] === jugador &&
        tablero.celdas[fila][col + 3] === jugador
      ) {
        return true;
      }
    }
  }
  return false;
}

function verificarGanadorDiagonal(tablero, jugador) {
  for (let fila = 0; fila <= tablero.filas - 4; fila++) {
    for (let col = 0; col <= tablero.columnas - 4; col++) {
      // Diagonal hacia arriba y a la derecha
      if (
        tablero.celdas[fila][col] === jugador &&
        tablero.celdas[fila + 1][col + 1] === jugador &&
        tablero.celdas[fila + 2][col + 2] === jugador &&
        tablero.celdas[fila + 3][col + 3] === jugador
      ) {
        return true;
      }

      // Diagonal hacia arriba y a la izquierda
      if (
        tablero.celdas[fila][col + 3] === jugador &&
        tablero.celdas[fila + 1][col + 2] === jugador &&
        tablero.celdas[fila + 2][col + 1] === jugador &&
        tablero.celdas[fila + 3][col] === jugador
      ) {
        return true;
      }
    }
  }
  return false;
}


function verificarGanador(tablero) {
  if (verificarGanadorVertical(tablero, 1) || verificarGanadorHorizontal(tablero, 1) || verificarGanadorDiagonal(tablero, 1)) {
    // El jugador 1 gana.
    alert("JUGADOR 1 GANA!");
    console.log("¡Jugador 1 gana!");
    reiniciarJuego(tablero);
    tablero.inicializarFicha(); //CUANDO ALGUIEN GANA SE TIENEN QUE INICIALIZAR LAS FICHAS DEL COSTADO
  } else if (verificarGanadorVertical(tablero, 2) || verificarGanadorHorizontal(tablero, 2) || verificarGanadorDiagonal(tablero, 2)) {
    // El jugador 2 gana.
    alert("JUGADOR 2 GANA!");
    console.log("¡Jugador 2 gana!");
    reiniciarJuego(tablero);
    tablero.inicializarFicha();
  } else {
    // No hay ganador todavía.
  }
}

function reiniciarJuego(tablero) {
  tablero.inicializarTablero(); // Limpia las fichas del tablero.
  tablero.dibujarTablero(); // Vuelve a dibujar el tablero vacío.
  tablero.jugadorActual = 1; // Vuelve a iniciar con el jugador 1.
}