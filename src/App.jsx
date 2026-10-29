import { createEffect, createSignal, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store'; // <-- Fondamentale: usiamo lo Store
import Header from './components/header/Header';
import Section from './components/section/Section';
import SystemMetrics from './components/systemMetrics/SystemMetrics';
import ActivityLogSection from './components/activityLogSection/ActivityLogSection';
import Benchmark from './components/benchmark/Benchmark';
import MarketSummary from './components/marketSummary/MarketSummary';
import './App.scss';
import { useFPS } from './hooks/useFPS';
import { useMemory } from './hooks/useMemory';
import { useCPULoad } from './hooks/useCPULoad';
import { useUpdateTime } from './hooks/useUpdateTime';
import { generateMockTimeSeries } from './services/mockMarketData';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);
  const [datasetSize, setDatasetSize] = createSignal(100);
  const [updateRate, setUpdateRate] = createSignal(10);
  
  const [data, setData] = createStore([]);
  const [logs, setLogs] = createStore([]);

  const fps = useFPS();
  const memory = useMemory();
  const updateTime = useUpdateTime();
  const cpuLoad = useCPULoad(datasetSize, updateRate, fps);

  createEffect(() => {
    setLoading(true);
    try {
      const mockData = generateMockTimeSeries(datasetSize());
      const formattedData = mockData.map((item, index) => ({
        ...item,
        close: item.price.toString(),
        datetime: item.trend[item.trend.length - 1]?.datetime || new Date().toISOString(),
        id: `${item.symbol}-${index}`
      }));
      setData(formattedData);
      setError(null);
    } catch (err) {
      setError("Errore nella generazione dei dati mock");
    } finally {
      setLoading(false);
    }
  });

  createEffect(() => {
    const intervalMs = 1000 / updateRate();
    let lastLogTime = Date.now();

    const interval = setInterval(() => {
      if (data.length === 0) return;

      const randomIndex = Math.floor(Math.random() * data.length);
      const currentItem = data[randomIndex];

      const currentClose = parseFloat(currentItem.close) || 0;
      const newClose = (currentClose + (Math.random() - 0.5)).toFixed(2);
      const oldClose = currentClose.toFixed(2);
      const diff = parseFloat(newClose) - parseFloat(oldClose);
      const symbol = currentItem.symbol || "AAPL";

      setData(randomIndex, {
        ...currentItem,
        close: newClose,
        lastUpdated: Date.now(),
        flashDirection: diff > 0 ? "up" : diff < 0 ? "down" : null,
      });

      const now = Date.now();
      if (now - lastLogTime > 150) {
        lastLogTime = now;
        const timeString =
          new Date().toTimeString().split(" ")[0] +
          "." +
          String(new Date().getMilliseconds()).padStart(3, "0").slice(0, 2);
        const percentage =
          parseFloat(oldClose) !== 0
            ? ((diff / parseFloat(oldClose)) * 100).toFixed(2)
            : "0.00";

        const newLog = {
          id: `${now}-${Math.random()}`,
          time: timeString,
          symbol: symbol,
          oldPrice: oldClose,
          newPrice: newClose,
          change: percentage,
          isPositive: diff > 0,
          isNegative: diff < 0,
        };

        setLogs(produce(currentLogs => {
          currentLogs.unshift(newLog);
          if (currentLogs.length > 5) currentLogs.pop();
        }));
      }
    }, intervalMs);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <div className="app-container">
      <Header
        datasetSize={datasetSize}
        setDatasetSize={setDatasetSize}
        updateRate={updateRate}
        setUpdateRate={setUpdateRate}
      />

      <div className="metrics-container">
        <Section
          fps={fps}
          cpu={cpuLoad}
          memory={memory}
        />
        <SystemMetrics
          fps={fps}
          memory={memory}
          updateTime={updateTime}
        />
      </div>

      <main className="main-content">
        {(loading() || error()) && (
          <div className="status-banner">
            {loading() && <p>Loading market data...</p>}
            {error() && <p role="alert">Unable to load market data: {error()}</p>}
          </div>
        )}
        <div className="dashboard-grid">
          <ActivityLogSection logs={logs} />
          <Benchmark data={data} />
        </div>
      </main>

      <MarketSummary />
    </div>
  );
}

export default App;