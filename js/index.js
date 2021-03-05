const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const strObj = {
  lineWidth: 8, //定义笔刷线条大小
  eraserEnable: false, //橡皮擦画笔切换
  usingMouse: false, //鼠标触发时间默认设置false
  color: 'black', //颜色默认黑色
};

autoSetCanvasSize(canvas); //自动设置canvas宽高
listenToMouse(canvas);

function autoSetCanvasSize(canvas) {
  resize();
  window.onresize = function () {
    resize();
  };

  function resize() {
    let pageWidth = document.documentElement.clientWidth;
    let pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
  }
}
//切换橡皮擦
eraser.onclick = function () {
  strObj.eraserEnable = true;
  eraser.classList.add('active');
  brush.classList.remove('active');
};
//切换笔刷
brush.onclick = function () {
  strObj.eraserEnable = false;
  brush.classList.add('active');
  eraser.classList.remove('active');
};
//颜色切换
/* black.onclick=function(){
  ctx.fillStyle = 'black'
  ctx.strokeStyle = 'black'
  black.classList.add('active')
  red.classList.remove('active')
  yellow.classList.remove('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
red.onclick=function(){
  ctx.fillStyle = 'red'
  ctx.strokeStyle = 'red'
  black.classList.remove('active')
  red.classList.add('active')
  yellow.classList.remove('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
yellow.onclick=function(){
  ctx.fillStyle = 'yellow'
  ctx.strokeStyle = 'yellow'
  black.classList.remove('active')
  red.classList.remove('active')
  yellow.classList.add('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
green.onclick=function(){
  ctx.fillStyle = 'green'
  ctx.strokeStyle = 'green'
  black.classList.remove('active')
  red.classList.remove('active')
  yellow.classList.remove('active')
  green.classList.add('active')
  blue.classList.remove('active')
}
blue.onclick=function(){
  ctx.fillStyle = 'blue'
  ctx.strokeStyle = 'blue'
  black.classList.remove('active')
  red.classList.remove('active')
  yellow.classList.remove('active')
  green.classList.remove('active')
  blue.classList.add('active')
} */
//颜色切换性能优化
colors.onclick = function (e) {
  for (let i = 0; i < this.children.length; i++) {
    this.children[i].classList.remove('active');
  }
  e.target.classList.add('active');
  strObj.color = e.target.getAttribute('id');
  ctx.fillStyle = strObj.color;
  ctx.strokeStyle = strObj.color;
};
//清空画板
clear.onclick = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

//画笔大小切换
big.onclick = function () {
  strObj.lineWidth = 8;
  big.classList.add('active');
  middle.classList.remove('active');
  small.classList.remove('active');
};
middle.onclick = function () {
  strObj.lineWidth = 5;
  big.classList.remove('active');
  middle.classList.add('active');
  small.classList.remove('active');
};
small.onclick = function () {
  strObj.lineWidth = 2;
  big.classList.remove('active');
  middle.classList.remove('active');
  small.classList.add('active');
};
//画笔大小切换性能优化
/* line.onclick = function (e) {
  for (let i = 0; i < this.children.length; i++) {
    this.children[i].classList.remove('active');
  }
  e.target.classList.add('active');
  strObj.lineWidth = e.target.getAttribute('data-index');
}; */
//下载保存画板
download.onclick = function () {
  let url = canvas.toDataURL('image/png');
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = 'canvas画板.png';
  a.target = '_blank';
  a.click();
};

function listenToMouse(canvas) {
  strObj.usingMouse = false; //鼠标触发时间默认设置false
  let lastPoint = {
    x: undefined,
    y: undefined,
  }; //鼠标最后点击的点坐标初始化

  if (document.body.ontouchstart !== undefined) {
    //判断设备是否支持touch事件

    canvas.ontouchstart = function (a) {
      //touch开始
      console.log(a);
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;
      strObj.usingMouse = true;
      if (strObj.eraserEnable) {
        ctx.clearRect(x - 25, y - 25, 50, 50);
      } else {
        lastPoint = {
          x: x,
          y: y,
        };
      }
    };
    canvas.ontouchmove = function (a) {
      //touch移动
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;
      if (!strObj.usingMouse) {
        return;
      }

      if (strObj.eraserEnable) {
        ctx.clearRect(x - 10, y - 10, 20, 20);
      } else {
        const newPoint = {
          x: x,
          y: y,
        };
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };
    canvas.ontouchend = function () {
      //touch结束
      strObj.usingMouse = false;
    };
  } else {
    //如果不支持touch事件，则执行鼠标事件
    canvas.onmousedown = function (a) {
      //鼠标按下事件
      var x = a.clientX;
      var y = a.clientY;
      strObj.usingMouse = true;
      if (strObj.eraserEnable) {
        ctx.clearRect(x - 10, y - 10, 20, 20);
      } else {
        lastPoint = {
          x: x,
          y: y,
        };
        // drawPoint(x,y,1)
      }
    };
    canvas.onmousemove = function (a) {
      //鼠标移动事件
      var x = a.clientX;
      var y = a.clientY;
      if (!strObj.usingMouse) {
        return;
      }

      if (strObj.eraserEnable) {
        ctx.clearRect(x - 10, y - 10, 20, 20);
      } else {
        var newPoint = {
          x: x,
          y: y,
        };
        // drawPoint(x,y,1)
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };
    canvas.onmouseup = function () {
      //鼠标松开事件
      strObj.usingMouse = false;
    };
  }
}

function drawPoint(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineWidth = strObj.lineWidth;
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}
