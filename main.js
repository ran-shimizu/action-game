var UART_DEVICE;
var TIME = 60;
var COUNT_TIME;

//micro:bit BLE UUID
var UUID={};
UUID["UART_SERVICE"]                 ='6e400001-b5a3-f393-e0a9-e50e24dcca9e';
UUID["UART_SERVICE_CHARACTERISTICS"] ='6e400002-b5a3-f393-e0a9-e50e24dcca9e';

function connect(){
    navigator.bluetooth.requestDevice({
        filters: [{
            namePrefix: 'BBC micro:bit',
        }],
        optionalServices: [UUID["UART_SERVICE"]]
    })
    .then(device => {
        UART_DEVICE=device;
        return device.gatt.connect();
    })
    .then(server => {
        return server.getPrimaryService(UUID["UART_SERVICE"]);
    })
    .then(service => {
        return service.getCharacteristic(UUID["UART_SERVICE_CHARACTERISTICS"]);
    })
    .then(chara => {
        alert("BLE connected");
        characteristic=chara;
        characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged',onCharacteristicValueChanged);

        setInterval("bird()",100);
        setInterval("judge()",100);
        COUNT_TIME = setInterval("time()", 1000);
    })
    .catch(error => {
        alert("BLE error");
    });
}

function onCharacteristicValueChanged(e) {
    var str_arr=[];
    for(var i=0;i<this.value.byteLength;i++){
        str_arr[i]=this.value.getUint8(i);
    }
    var str=String.fromCharCode.apply(null,str_arr);
    if(str == "absolute"){
      $('#player')
      .animate({ top: 100, left: '+=70' })
      .animate({ top: 300, left: '+=70' });
    }
    if(str == "shake"){
      $('#player').animate({ left: '+=20' });
    }
}

function bird(){
  $('#bird').animate({ left: '-=5' });

  var off = $('#bird').offset();
  var counter = Math.floor( off.left / 100) + 1;

  if(off.left < -70){
    $('#bird').remove();
    $('.bird').html('<img src = "bird.png" id = "bird">');
  }

  else if(off.left > counter * 100 - 5 && off.left < counter * 100){
    hun(counter);
  }
}

function hun(i){
  var left = i * 100 + 20;
  $('.hun').html('<img src = "hun.png" id = "hun">');
  $('#hun')
  .animate({ left: left }, 0)
  .animate({ top: '410' }, 5000)
  .queue(function() {
    this.remove();
  });
}

function judge(){
  var off = $('#player').offset();
  var off2 = $('#hun').offset();

  if(off.left > 250 && off.left < 360 && off.top == 300){
    $('#player')
    .animate({ top: 470, left: 330 }, 1000)
    .queue(function() {
      this.remove();
    });
    $('#bird').remove();
    $('#hun').remove();
    clearInterval(COUNT_TIME);
    setTimeout("$('#gameover').show();", 1000);
  }

  if(off.left >= 500 && off.left <= 610 && off.top == 300){
    $('#player')
    .animate({ top: 470, left: 580 }, 1000)
    .queue(function() {
      this.remove();
    });
    $('#bird').remove();
    $('#hun').remove();
    clearInterval(COUNT_TIME);
    setTimeout("$('#gameover').show();", 1000);
  }

  if((off.left < off2.left && off.left + 100 > off2.left) && (off.top  < off2.top)){
    $('#player').remove();
    $('#bird').remove();
    $('#hun').remove();
    clearInterval(COUNT_TIME);
    $('#gameover').show();
  }

  if(TIME < 0){
    $('#player').remove();
    $('#bird').remove();
    $('#hun').remove();
    clearInterval(COUNT_TIME);
    $('#gameover').show();
  }

  if(off.left >= 1050){
    $('#bird').remove();
    $('#hun').remove();
    clearInterval(COUNT_TIME);
    $('#gameclear').show();
  }
}

function time(){
  document.getElementById("time").innerHTML = TIME;
  TIME--;
}
