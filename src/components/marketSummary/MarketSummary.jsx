import { getTimeSeries } from "../../services/twelveDataService";
import "./MarketSummary.scss";
import { For, createEffect, createMemo, createSignal } from "solid-js";

const companies = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "TSLA", name: "Tesla, Inc." }
];

const formatNumber = (value) => Number(value || 0).toLocaleString("en-US");
const formatMarketCap = (value) => value ? `$${Number(value).toLocaleString("en-US")}` : "N/D";

const getTrendPoints = (trend) => {
    if (trend.length < 2) return "";

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
        const loadMarketData = async () => {
            try {
                const responses = await Promise.all(
                    companies.map((company) => getTimeSeries(company.symbol, "1day", 30))
                );
                const rows = companies.map((company, index) => {
                    const series = responses[index];
                    const trend = (series.values || []).map((item) => ({
                        date: item.datetime,
                        price: Number(item.close),
                        volume: Number(item.volume || 0)
                    })).reverse();
                    const current = trend[trend.length - 1] || {};
                    const previous = trend[trend.length - 2] || current;
                    const changePercent = previous.price
                        ? ((current.price - previous.price) / previous.price) * 100
                        : 0;

                    return {
                        ...company,
                        price: current.price || 0,
                        changePercent,
                        volume: current.volume || 0,
                        marketCap: null,
                        trend
                    };
                });
                setData(rows);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Dati di mercato non disponibili");
            } finally {
                setLoading(false);
            }
        };

        loadMarketData();
    });

    const sortedData = createMemo(() => [...data()].sort((first, second) => {
        const { key, direction } = sort();
        const firstValue = first[key] ?? "";
        const secondValue = second[key] ?? "";
        const comparison = typeof firstValue === "string"
            ? firstValue.localeCompare(secondValue)
            : firstValue - secondValue;
        return direction === "asc" ? comparison : -comparison;
    }));

    const changeSort = (key) => setSort((previousSort) => ({
        key,
        direction: previousSort.key === key && previousSort.direction === "asc" ? "desc" : "asc"
    }));

    const heading = (label, key) => <button className="summary-sort" onClick={() => changeSort(key)}>{label}{sort().key === key && <span>{sort().direction === "asc" ? " ↑" : " ↓"}</span>}</button>;

    return <section className="market-summary">
        <div className="market-summary-heading">
            <div><h2>Market overview</h2><p>Quotazioni reali · trend giornaliero ultimo mese</p></div>
        </div>
        <div className="market-summary-table-container">
            <table className="market-summary-table">
                <thead><tr><th>{heading("Symbol", "symbol")}</th><th>{heading("Name", "name")}</th><th>{heading("Price", "price")}</th><th>{heading("Change %", "changePercent")}</th><th>{heading("Volume", "volume")}</th><th>{heading("Market Cap", "marketCap")}</th><th>Trend (1m)</th></tr></thead>
                <tbody>
                    {loading() && <tr><td colSpan="7" className="summary-status">Caricamento dati di mercato...</td></tr>}
                    {!loading() && error() && <tr><td colSpan="7" className="summary-status summary-error">{error()}</td></tr>}
                    {!loading() && !error() && <For each={sortedData()}>{(item) => {
                        const positive = item.changePercent >= 0;
                        return <tr key={item.symbol}>
                            <td><span className="company-symbol">{item.symbol}</span></td><td>{item.name}</td><td className="summary-price">${item.price.toFixed(2)}</td>
                            <td><span className={`summary-change ${positive ? "positive" : "negative"}`}>{positive ? "+" : ""}{item.changePercent.toFixed(2)}%</span></td>
                            <td>{formatNumber(item.volume)}</td><td>{formatMarketCap(item.marketCap)}</td>
                            <td className="trend-cell"><svg viewBox="0 0 100 42" role="img" aria-label={`${item.symbol} price trend`}><polyline points={getTrendPoints(item.trend)} fill="none" stroke={positive ? "#34d399" : "#fb7185"} stroke-width="2" vector-effect="non-scaling-stroke" /></svg></td>
                        </tr>;
                    }}</For>}
                </tbody>
            </table>
        </div>
        <p className="market-cap-note">Price, Change % e Volume derivano dall'ultima chiusura giornaliera. Market Cap non è incluso nel piano gratuito.</p>
    </section>;
};

export default MarketSummary;
