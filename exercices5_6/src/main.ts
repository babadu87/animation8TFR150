export abstract class Logic {
  init(canvas: HTMLCanvasElement, ctx: WebGLRenderingContext): void { }

  updateInput(delta: number): Promise<any> | void {
    return Promise.resolve();
  }

  updateLogic(delta: number): Promise<any> | void {
    return Promise.resolve();
  }

  updateOutput(delta: number): Promise<any> | void {
    return Promise.resolve();
  }
}

let canvas: HTMLCanvasElement;
let ctx: WebGLRenderingContext;

export function run(canvasId: string, logic: Logic) {
  return setup(canvasId)
    .then(() => logic.init(canvas, ctx))
    .then(() =>
      loop([
        (d) => logic.updateInput(d),
        (d) => logic.updateLogic(d),
        (d) => logic.updateOutput(d),
      ])
    );
}

export function requestFullScreen() {
  const method = canvas.requestFullscreen || canvas.webkitRequestFullScreen || function () { };
  method.apply(canvas);
}

function setup(canvasId: string) {
  canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  ctx = canvas.getContext('webgl');
  if (!ctx) {
    return Promise.reject('Impossible de récupérer le contexte WebGL!');
  }
  return Promise.resolve();
}

function requestAnimationFrame() {
  return new Promise<number>((resolve) => {
    window.requestAnimationFrame(resolve);
  });
}

function iterate(actions: ((delta: number) => void)[], delta: number) {
  let p = Promise.resolve();
  actions.forEach((a) => {
    p = p.then(() => {
      return a(delta);
    });
  });
  return p;
}

let lastTime = 0;

function loop(actions: ((delta: number) => void)[], time = 0): Promise<{}> {
  // Le temps est compté en millisecondes, on désire
  // l'avoir en secondes, sans avoir de valeurs trop énorme.
  const delta = clamp((time - lastTime) / 1000, 0, 0.1);
  lastTime = time;
  const nextLoop = (t: number) => loop(actions, t);
  return iterate(actions, delta)
    .then(requestAnimationFrame)
    .then(nextLoop);
}

function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

export function loadAsync(url: string, mime?: string, responseType?: XMLHttpRequestResponseType) {
  return new Promise<XMLHttpRequest>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', reject);
    xhr.addEventListener('load', () => {
      resolve(xhr);
    });
    if (mime) {
      xhr.overrideMimeType(mime);
    }
    xhr.open('GET', url);
    if (responseType) {
      xhr.responseType = responseType;
    }
    xhr.send(null);
  });
}