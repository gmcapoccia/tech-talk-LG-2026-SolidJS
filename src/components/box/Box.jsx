import './Box.scss';

const Box = (props) => {
    return(
        <div className="box">
            <p className="label">{props.label}</p>
            <p className={`value ${props.status ? `status-${props.status}` : ''}`}>{props.value}</p>
        </div>
    )
}

export default Box;