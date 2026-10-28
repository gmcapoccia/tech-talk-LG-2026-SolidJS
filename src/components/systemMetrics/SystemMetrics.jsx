import { onMount, onCleanup } from "solid-js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController
} from 'chart.js';
import "./SystemMetrics.scss";

// Registriamo anche il LineController per l'uso nativo
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

const parseMetricValue = (val) => {
    if (typeof val === "function") val = val();
    if (typeof val === "number") return val;
    if (!val) return 0;
    const cleaned = val.toString().replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
};

const SystemMetrics = (props) => {
    let canvasRef;
    let chartInstance;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Disabilita l'animazione per evitare il carico CPU
        scales: {
            x: { 
                ticks: { color: '#64748b', font: { size: 11 } }, 
                grid: { display: false } 
            },
            y: { 
                ticks: { color: '#64748b', font: { size: 11 } }, 
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                border: { dash: [4, 4] }
            }
        },
        plugins: {
            legend: { 
                position: 'right', 
                align: 'center',
                labels: { color: '#94a3b8', font: { size: 12 }, boxWidth: 8, usePointStyle: true } 
            },
            tooltip: { 
                backgroundColor: '#0f172a', 
                borderColor: '#1e293b', 
                borderWidth: 1,
                bodyFont: { size: 12 },
                titleFont: { size: 12 },
                padding: 10
            }
        }
    };

    onMount(() => {
        // Creiamo l'istanza nativa una sola volta sul Canvas
        chartInstance = new ChartJS(canvasRef, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Memory (MB)',
                        data: [],
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.15)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'FPS',
                        data: [],
                        borderColor: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: chartOptions
        });

        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            const newFps = parseMetricValue(props.fps);
            const newMemory = parseMetricValue(props.memory);

            // AGGIORNAMENTO NATIVO A COSTO ZERO:
            // Mutiamo direttamente gli array esistenti senza clonarli
            const labels = chartInstance.data.labels;
            const memoryData = chartInstance.data.datasets[0].data;
            const fpsData = chartInstance.data.datasets[1].data;

            labels.push(timeStr);
            memoryData.push(newMemory);
            fpsData.push(newFps);

            if (labels.length > 30) {
                labels.shift();
                memoryData.shift();
                fpsData.shift();
            }

            // 'none' impedisce ricalcoli di animazione costosi
            chartInstance.update('none');
        }, 1000);

        onCleanup(() => {
            clearInterval(interval);
            if (chartInstance) chartInstance.destroy();
        });
    });

    return (
        <div className="system-metrics-card">
            <h3>System Metrics (Real-time)</h3>

            <div className="chart-container">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default SystemMetrics;