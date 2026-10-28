import { For } from "solid-js";
import "./Benchmark.scss";

const Benchmark = (props) => {
  return (
    <div className="benchmark-container">
      <div className="table-container">
        <table className="market-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Price ($)</th>
              <th style={{ textAlign: "right" }}>Change</th>
            </tr>
          </thead>
          <tbody>
            <For
              each={props.data}
              fallback={
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      padding: "20px",
                    }}
                  >
                    Loading benchmark dataset...
                  </td>
                </tr>
              }
            >
              {(item, index) => {
                const prevItem = props.data[index() + 1];
                const price = parseFloat(item.close) || 0;
                const prevPrice = prevItem
                  ? parseFloat(prevItem.close) || 0
                  : price;

                const diff = price - prevPrice;
                const percentage =
                  prevPrice !== 0
                    ? ((diff / prevPrice) * 100).toFixed(2)
                    : "0.00";

                const isPositive = diff > 0;
                const isNegative = diff < 0;

                const timeFormatted =
                  item.datetime && item.datetime.includes(" ")
                    ? item.datetime.split(" ")[1]
                    : item.datetime || "12:00:00";

                let flashClass = "";
                if (item.flashDirection === "up") flashClass = "price-flash-up";
                if (item.flashDirection === "down")
                  flashClass = "price-flash-down";

                return (
                  <tr key={item.id}>
                    <td className="time-cell">{timeFormatted}</td>
                    <td>{item.symbol || item.name || "AAPL"}</td>
                    <td className={`price-cell ${flashClass}`}>
                      ${price.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {isPositive && (
                        <span className="badge badge-positive">
                          ▲ +{percentage}%
                        </span>
                      )}
                      {isNegative && (
                        <span className="badge badge-negative">
                          ▼ {percentage}%
                        </span>
                      )}
                      {!isPositive && !isNegative && (
                        <span className="badge badge-neutral">0.00%</span>
                      )}
                    </td>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Benchmark;
