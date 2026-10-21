import {createMemo} from "solid-js";

export function useCPULoad(datasetSize, updateRate, fps) {
    return createMemo(() => {
        const ds = typeof datasetSize === 'function' ? datasetSize() : datasetSize;
        const ur = typeof updateRate === 'function' ? updateRate() : updateRate;
        const f = typeof fps === 'function' ? fps() : fps;

        const baseLoad = Math.min(100, Math.round((ds / 10000) * (ur / 10) * 0.5 + (ur > 100 ? 40 : 10)));
        const fpsPenalty = f < 30 ? Math.round((30 - f) * 2) : 0;
        const calculatedLoad = Math.min(99, Math.max(5, baseLoad + fpsPenalty));
        const jitter = Math.floor(Math.random() * 5) - 2;

        return Math.min(100, Math.max(5, calculatedLoad + jitter));
    });
}
