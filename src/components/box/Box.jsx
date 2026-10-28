import './Box.scss';

const Box = (props) => {
    return (
        <div className="box">
            <p className="label">{props.label}</p>
            <p className={`value ${props.status ? `status-${typeof props.status === 'function' ? props.status() : props.status}` : ''}`}>
                {typeof props.value === 'function' ? props.value() : props.value}
            </p>
        </div>
    );
};

export default Box;