import { For } from "solid-js";
import './Header.scss';

export default function Header(props) {
  const datasetOptions = [100, 500, 1000, 5000, 10000];
  const rateOptions = [
    { label: '10/s', value: 10 },
    { label: '100/s', value: 100 },
    { label: '500/s', value: 500 },
    { label: '1.000/s', value: 1000 }
  ];

  return (
    <header className="dashboard-header">
      <div className="header-top">
        <div className="brand">
          <div className="logo-container">
            <svg className="solid-logo" viewBox="0 0 166 155" width="100%" height="100%">
              <path fill="#76b3e1" d="M163 35S110-4 69 5L10 24C1 27-3 38 3 46l18 25c5 7 16 9 24 5l80-38c18-8 38 2 38 2z"/>
              <path fill="#518ac8" d="M3 119s53 39 94 30l59-19c9-3 13-14 7-22l-18-25c-5-7-16-9-24-5l-80 38c-18 8-38-2-38-2z"/>
              <path fill="#315aa9" d="M12 40s53 39 94 30l59-19c9-3 13-14 7-22l-18-25c-5-7-16-9-24-5l-80 38c-18 8-38-2-38-2z"/>
            </svg>
          </div>
          <div className="brand-info">
            <div className="title-row">
              <h1>Tech Talk LG - 2026</h1>
              <span className="badge">No Virtual DOM</span>
            </div>
            <div className="subtitle-row">
              <span className="subtitle">Market Dashboard</span>
              <span className="description">Fine-grained reactivity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="controls-bar">
        <div className="control-group">
          <span className="group-label">Dataset size</span>
          <div className="btn-group">
            {/* Usiamo <For> e rendiamo reattiva la classe active con una arrow function */}
            <For each={datasetOptions}>
              {(size) => (
                <button
                  className={`control-btn ${props.datasetSize() === size ? 'active' : ''}`}
                  onClick={() => props.setDatasetSize(size)}
                >
                  {size.toLocaleString('it-IT')}
                </button>
              )}
            </For>
          </div>
        </div>

        <div className="control-group">
          <span className="group-label">Update rate</span>
          <div className="btn-group">
            <For each={rateOptions}>
              {(option) => (
                <button
                  className={`control-btn ${props.updateRate() === option.value ? 'active' : ''}`}
                  onClick={() => props.setUpdateRate(option.value)}
                >
                  {option.label}
                </button>
              )}
            </For>
          </div>
        </div>
      </div>
    </header>
  );
}