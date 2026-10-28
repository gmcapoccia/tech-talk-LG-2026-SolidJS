import "./Section.scss";
import Box from "../box/Box";
import { getFpsStatus, getCpuStatus, getMemoryStatus } from "../../utils/performance";

const Section = (props) => {
    return (
        <div className="section">
            <Box 
                label="FPS" 
                value={props.fps} 
                status={() => getFpsStatus(props.fps())} 
            />
            <Box 
                label="CPU (tab)" 
                value={() => `${props.cpu()}%`} 
                status={() => getCpuStatus(props.cpu())} 
            />
            <Box 
                label="Memory" 
                value={() => `${props.memory().toFixed(2)} MB`} 
                status={() => getMemoryStatus(props.memory())} 
            />
        </div>
    );
};

export default Section;