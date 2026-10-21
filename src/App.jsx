import { createSignal } from 'solid-js';
import Header from './components/header/Header';
import Section from './components/section/Section';
import SystemMetrics from './components/systemMetrics/SystemMetrics';
import './App.scss';
import { useFPS } from './hooks/useFPS';
import { useMemory } from './hooks/useMemory';
import { useCPULoad } from './hooks/useCPULoad';
import { useUpdateTime } from './hooks/useUpdateTime';

function App() {
  const [datasetSize, setDatasetSize] = createSignal(100);
  const [updateRate, setUpdateRate] = createSignal(10);
  const fps = useFPS();
  const memory = useMemory();
  const cpuLoad = useCPULoad(datasetSize, updateRate, fps);
  const updateTime = useUpdateTime();

  return (
    <div className="App">
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

      {/* SEGNAPOSTI PER LE PROSSIME COMPONENTI */}
      {/* 

      <main className="main-content">
        <ActivityLogSection />
        <Benchmark />
      </main>

      <MarketSummary />
      */}
    </div>
  );
}

export default App;
