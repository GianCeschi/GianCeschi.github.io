/*class Ficha extends Figura{
    constructor(posx,posy,radio,fill,context){
        super(posx,posy,fill,context);
        this.radio = radio;
    }

    draw(){
        super.draw();
        this.context.beginPath();
        this.context.arc(this.posx,this.posy, this.radio, 0,2 * Math.PI);
        this.context.fill();
        this.context.closePath();
    }

    getRadio(){
        return this.radio;
    }

    isPointInside(x,y){
        let _x = this.posx - x;
        let _y = this.posy - y;
        return Math.sqrt(_x * _x + _y * _y) < this.radio;
    }

} */

class Ficha {
    constructor(ctx, x, y, radio, imagenSrc) { //ACA LE TENGO QUE PASAR LA IMAGEN POR PARAMETRO.
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.radio = radio;
      this.imagen = new Image();
    this.imagen.src = imagenSrc;
      
      this.arrastrando = false;

        // Esperar a que la imagen se cargue antes de dibujarla
    this.imagen.onload = () => {
      this.dibujar();
    };
  
    }

    
  
    dibujar() {
      // Dibujar el círculo
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
      this.ctx.fill();
  
      // Colocar la imagen en el centro del círculo
      const imagenX = this.x - this.radio;
      const imagenY = this.y - this.radio;
      const imagenAncho = this.radio * 2;
      const imagenAlto = this.radio * 2;
      this.ctx.drawImage(this.imagen, imagenX, imagenY, imagenAncho, imagenAlto);
    }
  
    verificarClic(x, y) {
      const distancia = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
      return distancia <= this.radio;
    }
  }