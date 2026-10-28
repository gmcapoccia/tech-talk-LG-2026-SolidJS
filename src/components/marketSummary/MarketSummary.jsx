// import { getTimeSeries } from "../../services/twelveDataService";
import "./MarketSummary.scss";
import { For, createEffect, createMemo, createSignal } from "solid-js";
import { FaBrandsApple, FaBrandsMicrosoft } from "solid-icons/fa";
import { SiNvidia, SiTesla } from "solid-icons/si";
import { generateMockTimeSeries } from '../../services/mockMarketData';

const companies = [
  { symbol: "AAPL", name: "Apple Inc.", icon: FaBrandsApple },
  { symbol: "MSFT", name: "Microsoft Corporation", icon: FaBrandsMicrosoft },
  { symbol: "NVDA", name: "NVIDIA Corporation", icon: SiNvidia },
  { symbol: "TSLA", name: "Tesla, Inc.", icon: SiTesla },
];

const formatNumber = (value) => Number(value || 0).toLocaleString("en-US");

const getTrendPoints = (trend) => {
  if (!trend || trend.length < 2) return "";

  const prices = trend.map((item) => item.price);
  const min = Math.min(...prices);
  const range = Math.max(...prices) - min || 1;

  return prices
    .map((price, index) => {
      const x = (index / (prices.length - 1)) * 100;
      const y = 38 - ((price - min) / range) * 34;
      return `${x},${y}`;
    })
    .join(" ");
};

const MarketSummary = () => {
  const [data, setData] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [sort, setSort] = createSignal({ key: "symbol", direction: "asc" });

  createEffect(() => {
    try {
        const mockRows = generateMockTimeSeries(4).map((item, index) => ({
          ...item,
          icon: companies[index % companies.index || index].icon,
        }));
        setData(mockRows);
        setError(null);
    } catch (err) {
        setError("Dati di mercato non disponibili");
    } finally {
        setLoading(false);
    }
  });

  const sortedData = createMemo(() =>
    [...data()].sort((first, second) => {
      const { key, direction } = sort();
      const firstValue = first[key] ?? "";
      const secondValue = second[key] ?? "";
      const comparison =
        typeof firstValue === "string"
          ? firstValue.localeCompare(secondValue)
          : firstValue - secondValue;
      return direction === "asc" ? comparison : -comparison;
    })
  );

  const changeSort = (key) =>
    setSort((previousSort) => ({
      key,
      direction:
        previousSort.key === key && previousSort.direction === "asc"
          ? "desc"
          : "asc",
    }));

  const heading = (label, key) => (
    <button className="summary-sort" onClick={() => changeSort(key)}>
      {label}
      {sort().key === key && (
        <span>{sort().direction === "asc" ? " ↑" : " ↓"}</span>
      )}
    </button>
  );

  return (
    <section className="market-summary">
      <div className="market-summary-heading">
        <div>
          <h2>Market overview</h2>
          <p>Real-time quotes · daily trend last month</p>
        </div>
      </div>
      <div className="market-summary-table-container">
        <table className="market-summary-table">
          <thead>
            <tr>
              <th>{heading("Symbol", "symbol")}</th>
              <th>{heading("Name", "name")}</th>
              <th>{heading("Price", "price")}</th>
              <th>{heading("Change %", "changePercent")}</th>
              <th>{heading("Volume", "volume")}</th>
              <th>Trend (1m)</th>
            </tr>
          </thead>
          <tbody>
            {loading() && (
              <tr>
                <td colSpan="6" className="summary-status">
                  Loading market data...
                </td>
              </tr>
            )}
            {!loading() && error() && (
              <tr>
                <td colSpan="6" className="summary-status summary-error">
                  {error()}
                </td>
              </tr>
            )}
            {!loading() && !error() && (
              <For each={sortedData()}>
                {(item) => {
                  const Icon = item.icon;
                  const positive = item.changePercent >= 0;
                  return (
                    <tr>
                      <td>
                        <span className="company-symbol">
                          {Icon && <Icon />}
                          {item.symbol}
                        </span>
                      </td>
                      <td>{item.name}</td>
                      <td className="summary-price">
                        ${item.price.toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`summary-change ${positive ? "positive" : "negative"}`}
                        >
                          {positive ? "+" : ""}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td>{formatNumber(item.volume)}</td>
                      <td className="trend-cell">
                        <div style={{ width: "100%", height: "42px", display: "block" }}>
                          <svg
                            viewBox="0 0 100 42"
                            width="100%"
                            height="100%"
                            preserveAspectRatio="none"
                            role="img"
                            aria-label={`${item.symbol} price trend`}
                          >
                            <polyline
                              points={getTrendPoints(item.trend)}
                              fill="none"
                              stroke={positive ? "#34d399" : "#fb7185"}
                              strokeWidth="2"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  );
                }}
              </For>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MarketSummary;