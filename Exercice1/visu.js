/* eslint-disable no-unused-vars */

let Vector;
let Matrix;

let p;

function Refresh() {
  const canvas = document.getElementById("view");
  const context = canvas.getContext("2d");
  context.fillStyle="black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.moveTo(0, canvas.height/2);
  context.lineTo(canvas.width, canvas.height/2);
  context.lineWidth = 3;
  context.strokeStyle = '#ff0000';
  context.stroke();

  context.beginPath();
  context.moveTo(canvas.width/2, 0);
  context.lineTo(canvas.width/2, canvas.height);
  context.lineWidth = 3;
  context.strokeStyle = '#00ff00';
  context.stroke();

  context.beginPath();
  context.arc(p.x + canvas.width/2, canvas.height/2 - p.y, 4, 0, 2 * Math.PI, false);
  context.fillStyle = '#ffff00';
  context.fill();

  const ptSpan = document.getElementById("point");
  ptSpan.innerText = `x: ${p.x}, y: ${p.y}, z: ${p.z}`;
}

function ApplyMatrix(m) {
  p = m.mul(p);
  Refresh();
}

function DoTranslate() {
  const dx = parseFloat(document.getElementById("dx").value);
  const dy = parseFloat(document.getElementById("dy").value);
  const dz = parseFloat(document.getElementById("dz").value);
  const m = Matrix.fromTranslation(dx, dy, dz);
  ApplyMatrix(m);
}

function DoScale() {
  const sx = parseFloat(document.getElementById("sx").value);
  const sy = parseFloat(document.getElementById("sy").value);
  const sz = parseFloat(document.getElementById("sz").value);
  const m = Matrix.fromScale(sx, sy, sz);
  ApplyMatrix(m);
}

function Rot(fn) {
  const deg = parseFloat(document.getElementById("angle").value);
  const rad = deg * Math.PI / 180;
  const m = fn(rad);
  ApplyMatrix(m);
}

function RotPitch() {
  Rot(Matrix.fromPitch);
}

function RotYaw() {
  Rot(Matrix.fromYaw);
}

function RotRoll() {
  Rot(Matrix.fromRoll);
}

require(["src/vec", "src/matrix"], (vec, matrix) => {
  Vector = vec.Vector;
  Matrix = matrix.Matrix;
  p = new Vector(80, 60, 30);
  Refresh();
});