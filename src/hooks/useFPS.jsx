import { createSignal, onMount, onCleanup } from "solid-js";

export const useFPS = () => {
  const [fps, setFps] = createSignal(0);

  onMount(() => {
    let frames = 0;
    let lastTime = performance.now();
    let frameId;

    const loop = (currentTime) => {
      frames++;

      if (currentTime - lastTime >= 1000) {
        setFps(frames);
        frames = 0;
        lastTime = currentTime;
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    onCleanup(() => {
      cancelAnimationFrame(frameId);
    });
  });

  return fps;
};