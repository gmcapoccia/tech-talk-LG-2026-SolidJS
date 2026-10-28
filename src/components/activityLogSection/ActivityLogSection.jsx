import { For } from "solid-js"; // Importa il controllo di flusso nativo
import "./ActivityLogSection.scss";

const ActivityLogSection = (props) => {
    // Essendo uno Store, accediamo direttamente a props.logs senza parentesi tonde
    const logs = () => props.logs; 

    return (
        <div className="activity-log-section">
            <div className="table-container">
                <table className="market-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Symbol</th>
                            <th>Old Price</th>
                            <th>New Price</th>
                            <th style={{ textAlign: "right" }}>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.logs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    style={{
                                        textAlign: "center",
                                        color: "#6b7280",
                                        padding: "20px",
                                    }}
                                >
                                    Waiting for live updates...
                                </td>
                            </tr>
                        ) : (
                            // Usiamo <For> invece di .map() per una gestione ultra-performante delle righe
                            <For each={props.logs}>
                                {(log) => (
                                    <tr>
                                        <td className="time-cell">{log.time}</td>
                                        <td>{log.symbol}</td>
                                        <td>${log.oldPrice}</td>
                                        <td className="price-cell">${log.newPrice}</td>
                                        <td style={{ textAlign: "right" }}>
                                            {log.isPositive && (
                                                <span className="badge badge-positive">
                                                    ▲ +{log.change}%
                                                </span>
                                            )}
                                            {log.isNegative && (
                                                <span className="badge badge-negative">
                                                    ▼ {log.change}%
                                                </span>
                                            )}
                                            {!log.isPositive && !log.isNegative && (
                                                <span className="badge badge-neutral">0.00%</span>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </For>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ActivityLogSection;