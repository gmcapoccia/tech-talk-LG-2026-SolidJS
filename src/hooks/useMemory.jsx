import {createSignal, onMount, onCleanup} from "solid-js";

export const useMemory = () => {
    const [memory, setMemory] = createSignal(0);

    onMount(() => {
        const interval = setInterval(() => {
        if (performance.memory) {
            const memoryMB =
            performance.memory.usedJSHeapSize / 1024 / 1024;

            setMemory(memoryMB);
        }
        }, 1000);

        onCleanup(() => {
            clearInterval(interval);
        });
    });

    return memory;

}