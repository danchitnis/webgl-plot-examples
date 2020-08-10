import { wrap, transfer } from "comlink";

const init = async () => {
  const htmlCanvas = document.getElementById("my_canvas") as HTMLCanvasElement;

  const offscreen = htmlCanvas.transferControlToOffscreen();

  offscreen.width = htmlCanvas.clientWidth * window.devicePixelRatio;
  offscreen.height = htmlCanvas.clientHeight * window.devicePixelRatio;

  const worker = new Worker("./offScreen-worker", { type: "module" });
  const workerApi = wrap<import("./offScreen-worker").CanvasWorker>(worker);
  await workerApi.run(transfer(offscreen, [offscreen]));
  await workerApi.set(0.8);
};

init();

document.getElementById("btBusy").addEventListener("click", () => {
  const info = document.getElementById("info");

  info.innerHTML =
    "Main thread working...<br>Check the console (F12)<br> Try resizing the window now";

  let a = 0;
  const total = 100000000;

  for (let i = 0; i < total; i++) {
    a = a + Math.sin(i);
    if (i % (total / 20) == 0) {
      console.log(((100 * i) / total).toFixed(0) + "%");
    }
  }
  info.innerHTML = "Done!";
});
