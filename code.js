var canvas = document.getElementById('paint');
var ctx = canvas.getContext('2d');

var sketch = document.getElementById('sketch');
var sketch_style = getComputedStyle(sketch);
canvas.width = 100;
canvas.height = 100;

var mouse = {x: 0, y: 0};

var ctx_is_done = false;
var ex_shown=false;
var last_data;
var last_dataURL;
/* Mouse Capturing Work */
canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
}, false);

/* Drawing on Paint App */
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

ctx.strokeStyle = "white";
function setColor(colour){ctx.strokeStyle = colour;}

ctx.lineWidth = 10;
function setSize(size){ctx.lineWidth = size;}

function testSVM(){
  document.getElementById("extra").innerHTML= "<h2>SVM Guess: </h2>" + "<img class='loader' src=./loader.gif>"
  var dataURL = canvas.toDataURL();
  last_dataURL = dataURL;

  $.ajax({
    type: "POST",
    url: "./query/",
    data: {
       img: dataURL
    },
    success: function (data) {
         console.log(data);
         document.getElementById("extra").innerHTML="<h2>SVM Guess: </h2>" + "<h2>" + data+'</h2>Is this answer: <br/><button onclick=submitCanvas(1); type="button" class="btn btn-success">Correct</button>&nbsp;or&nbsp;<button onclick=submitCanvas(0); type="button" class="btn btn-danger">Wrong</button>';
         last_data=data;
     }
  }).done(function(o) {
    console.log(dataURL);
    console.log('saved');
    ctx_is_done = true;
  });
  }
  function submitCanvas(truth_state){
    var dataURL = last_dataURL;
    if (truth_state==0){
      var correct_label = prompt("Which Digit did you draw?", "Enter a digit from 0 - 9");
      if (correct_label != null) {
          last_data = parseInt(correct_label);
      }
    }
    $.ajax({
      type: "POST",
      url: "./mongoSubmit/",
      data: {
         img: dataURL,
         correct: truth_state,
         prediction: parseInt(last_data)
      },
      success: function (data) {
           console.log(data);
           document.getElementById("extra").innerHTML="<h2>SVM Guess: </h2><h3>Data Submitted to MongoDB for Training!</h3><br/><h4>Thank you! Feel free to drawn again</h4>";
       }
    }).done(function(o) {
      console.log(dataURL);
      console.log('saved');
      ctx_is_done = true;
    });
    }
canvas.addEventListener('mousedown', function(e) {
    if (ctx_is_done == true){
      ctx_is_done = false;
      clearCanvas();
    }
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    canvas.addEventListener('mousemove', onPaint, false);
    }, false);

canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

var onPaint = function() {
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    };

function clearCanvas(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("extra").innerHTML="<h2>SVM Guess: </h2>";
  }

function toggleExample(){
  if(ex_shown==false){
    $("#example_alert").fadeIn(500);
    ex_shown=true;
  }
  else{
    $("#example_alert").fadeOut(500);
    ex_shown=false;
  }

}
