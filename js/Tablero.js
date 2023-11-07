class Tablero {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.celdas = [];
    this.tableroWidth = 500; // Ancho deseado del tablero
    this.tableroHeight = 500; // Alto deseado del tablero  ESTO PARA DARLE UN TAMAÑO AL TABLERO QUE NO SEA DE TODO EL CANVAS
   
    this.anchoCelda = this.tableroWidth / this.columnas;
    this.altoCelda = this.tableroHeight / this.filas;
    this.jugadorActual = 1;
    this.FICHASINICIALES = this.columnas * this.filas / 2; //PARA CADA JUGADOR
    this.fichasJugador1 = [];  
    this.fichasJugador2 = [];
    this.juegoTerminado = false; //PARA FRENAR EL TEMPORIZADOR SI HAY GANADOR

    // Inicializa el temporizador
    //this.inicializarTemporizador();
    
    this.fichaSeleccionada = null;
   
    this.inicializarTablero();
    this.dibujarTablero();
    this.inicializarFichas();
  }

  inicializarTemporizador() {

    this.tiempoRestante = 60; // Tiempo inicial en segundos
    this.temporizador = document.getElementById('tiempo');
    clearInterval(this.temporizadorInterval); // Detiene el intervalo anterior si existe. Porque sino avanza cada vez mas rapido el reloj
  
    const intervalo = 1000; // Intervalo de actualización del temporizador en milisegundos (1 segundo)
  
    const actualizarTemporizador = () => {
  
      // Actualiza el contenido del div del temporizador
      this.temporizador.textContent = ` ${this.tiempoRestante} `;
  
      if (this.tiempoRestante === 0) {
        // Cuando el tiempo llega a cero, reinicia el temporizador y muestra un mensaje
        alert("¡Se terminó el tiempo!");
        this.tiempoRestante = 60; // Reinicia el tiempo a 60 segundos
        this.inicializarTemporizador(); // Reinicia el temporizador
        reiniciarJuego(this);
        this.inicializarFichas(); //APARECEN INMEDIATAMENTE SE REINICIA EL JUEGO POR QUEDARSE SIN TIEMPO.
      }
      else {
        this.tiempoRestante--; // Resta después
      }
    };
  
    // Inicia el temporizador y lo actualiza en cada intervalo
    this.temporizadorInterval = setInterval(actualizarTemporizador, intervalo);
  }
  


  inicializarTablero() {
    for (let fila = 0; fila < this.filas; fila++) {
      this.celdas[fila] = [];
      for (let col = 0; col < this.columnas; col++) {
        this.celdas[fila][col] = 0;
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
        this.ctx.arc(x + this.anchoCelda / 2, y + this.altoCelda / 2, 23, 0, Math.PI * 2);
        this.ctx.fill();
        if (this.celdas[fila][col] === 1) {
          this.ficha = new Ficha(this.ctx, x + this.anchoCelda / 2, y + this.altoCelda / 2, 23, 'img/fichaIronMan.png');
          this.ficha.dibujar();
        } else if (this.celdas[fila][col] === 2) {
          this.ficha = new Ficha(this.ctx, x + this.anchoCelda / 2, y + this.altoCelda / 2, 23, 'img/fichaLoki.jpg');
          this.ficha.dibujar();
        }

        this.ctx.strokeStyle = "#f34545"; //COLOR DE LAS LINEAS DEL TABLERO
        this.ctx.strokeRect(x, y, this.anchoCelda, this.altoCelda);
      }
    }
  }


  //INICIALIZAMOS LA FICHA PARA EL JUGADOR SELECCIONAR
  inicializarFichas() {
    // Inicializar las fichas para ambos jugadores
    const numFichas = this.FICHASINICIALES;

    for (let i = 0; i < numFichas; i++) {
      const x1 = this.canvas.width - 50;
      const x2 = this.canvas.width - 200;; // Cambio la posición inicial del jugador 2
      let y = 40 + i * 10; // Ajustar el espaciado

      // Crear una instancia de Ficha para cada jugador y agregarlas a los arreglos correspondientes
      const fichaJugador1 = new Ficha(this.ctx, x1, y, 23, 'img/fichaIronMan.png');
      this.fichasJugador1.push(fichaJugador1);

      const fichaJugador2 = new Ficha(this.ctx, x2, y, 23, 'img/fichaLoki.jpg');
      this.fichasJugador2.push(fichaJugador2);
    }
  
    this.canvas.addEventListener('mousedown', (event) => {
      if (this.jugadorActual === 1) {
        const x = event.offsetX;
        const y = event.offsetY;
    
        // Verificar si se hizo clic en una ficha del jugador 1
        for (const ficha of this.fichasJugador1) {
          if (ficha.verificarClic(x, y)) {
            this.fichaSeleccionada = ficha;
            break;
          }
        }
      } else if (this.jugadorActual === 2) {
        const x = event.offsetX;
        const y = event.offsetY;
    
        // Verificar si se hizo clic en una ficha del jugador 2
        for (const ficha of this.fichasJugador2) {
          if (ficha.verificarClic(x, y)) {
            this.fichaSeleccionada = ficha;
            break;
          }
        }
      }
    });
    
   this.canvas.addEventListener('mousemove', (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.dibujarTablero();
  
  // Dibujar todas las fichas de ambos jugadores
  for (const ficha of this.fichasJugador1) {
    ficha.dibujar();
  }
  for (const ficha of this.fichasJugador2) {
    ficha.dibujar();
  }

  if (this.fichaSeleccionada) {
    this.fichaSeleccionada.x = x;
    this.fichaSeleccionada.y = y;
    this.fichaSeleccionada.dibujar();
  }
});

    
this.canvas.addEventListener('mouseup', () => {
  if (this.fichaSeleccionada) {
    const col = Math.floor(this.fichaSeleccionada.x / this.anchoCelda);

    if (col >= 0 && col < this.columnas) {
      // La ficha se suelta en una celda válida del tablero
      this.jugar(col,this.fichaSeleccionada);
      verificarGanador(this);
    } else {
      // La ficha se suelta fuera del tablero, devolverla al arreglo
      if (this.jugadorActual === 1) {
        this.fichasJugador1.push(this.fichaSeleccionada);
      } else if (this.jugadorActual === 2) {
        this.fichasJugador2.push(this.fichaSeleccionada);
      }
    }

    this.fichaSeleccionada = null;
  }
});

  }


  colocarFichaEnTablero(ficha, col) {
    for (let fila = this.filas - 1; fila >= 0; fila--) {
      if (this.celdas[fila][col] === 0) {
        this.celdas[fila][col] = this.jugadorActual;
        this.fichaSeleccionada = null;
        this.dibujarTablero();
        break;
      }
    }
  }

  jugar(col,ficha) {
    if (this.jugadorActual === 1 && this.fichasJugador1.length > 0) {
      this.fichasJugador1 = this.fichasJugador1.filter((f) => f !== ficha); // Remover la ficha del arreglo
      this.colocarFichaEnTablero(ficha, col);
      this.jugadorActual = 2; // Cambiar al jugador 2
    } else if (this.jugadorActual === 2 && this.fichasJugador2.length > 0) {
      this.fichasJugador2 = this.fichasJugador2.filter((f) => f !== ficha); // Remover la ficha del arreglo
      this.colocarFichaEnTablero(ficha, col);
      this.jugadorActual = 1; // Cambiar al jugador 1
    }
  }


}

//Le doy funcionalidad al boton reiniciar!

let btnReiniciar = document.getElementById('reiniciar');
btnReiniciar.addEventListener('click', function() {  
  reiniciarJuego(tablero); 
});

const botonesJugar = document.querySelectorAll('#jugar');

botonesJugar.forEach((boton) => {
  boton.addEventListener('click', (event) => {
    const valor = parseInt(event.target.value);
    const filas = valor + 2; // Ajusta las filas según el valor seleccionado
    const columnas = valor + 3; // Ajusta las columnas según el valor seleccionado
    tablero.numeroEnLinea = valor; // Configura el número en línea según el valor seleccionado

     // Mostrar el canvas cuando se selecciona una opcion de juego!!
     const canvas = document.getElementById('canvas');
     canvas.style.display = 'block';

    reiniciarJuegoConNuevasDimensiones(tablero, filas, columnas);
  });
});

function reiniciarJuegoConNuevasDimensiones(tablero, filas, columnas) {
  // Reinicia el juego con las nuevas dimensiones
  tablero.filas = filas;
  tablero.columnas = columnas;
  tablero.anchoCelda = tablero.tableroWidth / tablero.columnas;
  tablero.altoCelda = tablero.tableroHeight / tablero.filas;

  tablero.FICHASINICIALES = columnas * filas / 2;

  // Limpia y reinicia el juego
  reiniciarJuego(tablero);
}

const tablero = new Tablero();

tablero.inicializarFicha(); // Inicializa la ficha arrastrable 

// Se pueden agregar eventos de clic para permitir que los jugadores seleccionen una columna para jugar.
tablero.canvas.addEventListener('click', (event) => {
  const col = Math.floor(event.offsetX / tablero.anchoCelda);
  tablero.jugar(col);
  // Después de que un jugador ha jugado, verifica si hay un ganador.
  verificarGanador(tablero);
});

function verificarGanadorVertical(tablero, jugador) {
  for (let col = 0; col < tablero.columnas; col++) {
    for (let fila = 0; fila <= tablero.filas - tablero.numeroEnLinea; fila++) {
      // Verifica si hay "tablero.numeroEnLinea" fichas iguales en una columna
      let ganador = true;
      for (let i = 0; i < tablero.numeroEnLinea; i++) {
        if (tablero.celdas[fila + i][col] !== jugador) {
          ganador = false;
          break;
        }
      }
      if (ganador) {
        return true;
      }
    }
  }
  return false;
}

function verificarGanadorHorizontal(tablero, jugador) {
  for (let fila = 0; fila < tablero.filas; fila++) {
    for (let col = 0; col <= tablero.columnas - tablero.numeroEnLinea; col++) {
      // Verifica si hay "tablero.numeroEnLinea" fichas iguales en una fila
      let ganador = true;
      for (let i = 0; i < tablero.numeroEnLinea; i++) {
        if (tablero.celdas[fila][col + i] !== jugador) {
          ganador = false;
          break;
        }
      }
      if (ganador) {
        return true;
      }
    }
  }
  return false;
}

function verificarGanadorDiagonal(tablero, jugador) {
  for (let fila = 0; fila <= tablero.filas - tablero.numeroEnLinea; fila++) {
    for (let col = 0; col <= tablero.columnas - tablero.numeroEnLinea; col++) {
      // Verifica si hay "tablero.numeroEnLinea" fichas iguales en una diagonal hacia arriba y a la derecha
      let ganador = true;
      for (let i = 0; i < tablero.numeroEnLinea; i++) {
        if (tablero.celdas[fila + i][col + i] !== jugador) {
          ganador = false;
          break;
        }
      }
      if (ganador) {
        return true;
      }

      // Verifica si hay "tablero.numeroEnLinea" fichas iguales en una diagonal hacia arriba y a la izquierda
      ganador = true;
      for (let i = 0; i < tablero.numeroEnLinea; i++) {
        if (tablero.celdas[fila + i][col + tablero.numeroEnLinea - 1 - i] !== jugador) {
          ganador = false;
          break;
        }
      }
      if (ganador) {
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
    tablero.juegoTerminado = true; // Establece el juego como terminado
    clearInterval(tablero.temporizadorInterval); // Paro el temporizador
  } else if (verificarGanadorVertical(tablero, 2) || verificarGanadorHorizontal(tablero, 2) || verificarGanadorDiagonal(tablero, 2)) {
    // El jugador 2 gana.
    alert("JUGADOR 2 GANA!");
    console.log("¡Jugador 2 gana!");
    tablero.juegoTerminado = true; // Establece el juego como terminado
    clearInterval(tablero.temporizadorInterval); // Paro el temporizador
  } else {
    // No hay ganador todavía. HACER EMPATE!
  }
}

function reiniciarJuego(tablero) {
  tablero.inicializarTemporizador();
  tablero.inicializarTablero(); // Limpia las fichas del tablero.
  tablero.dibujarTablero(); // Vuelve a dibujar el tablero vacío.
  tablero.inicializarFichas();
  tablero.jugadorActual = 1; // Vuelve a iniciar con el jugador 1.
}