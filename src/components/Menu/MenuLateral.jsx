import { useState } from "react";
import { ToggleMenuSvg } from "../Svgs";

export default function MenuLateral() {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <><div className="p-1">
            <div style={{ maxHeight: '78.5vh', overflowY: 'auto', backgroundColor: '#171717' }}
                className={`p-5 rounded-lg top-0 left-0 h-screen ${expanded ? 'w-60' : 'w-16'} bg-black rounded-md border-white transition-all duration-500`}>

                <div className="cursor-pointer" onClick={toggleExpanded}>
                    <ToggleMenuSvg />
                </div>
            </div>
        </div>
        </>
    );
}
