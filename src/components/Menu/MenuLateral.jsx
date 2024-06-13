import React, { useState } from 'react';
import { ToggleMenuSvg } from '../Svgs';

const MenuLateral = ({ setContent }) => {
    const [expanded, setExpanded] = useState(false);

    const handleMenuClick = (contentType) => {
        setContent(contentType);
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="p-1">
            <div
                style={{ maxHeight: '78.5vh', overflowY: 'auto', backgroundColor: '#171717' }}
                className={`p-3 rounded-lg top-0 left-0 h-screen ${expanded ? 'w-60' : 'w-16'} 
        bg-black rounded-md border-white transition-all duration-500 `}
            >
                <div
                    className="cursor-pointer flex items-center justify-center h-8"
                    onClick={toggleExpanded}
                >
                    <ToggleMenuSvg />
                </div>

                <div
                    className="bg-[#676767] hover:bg-[#2C6BB2] rounded-lg h-10 w-10 flex items-center justify-center cursor-pointer mt-4"
                    onClick={() => handleMenuClick('adicionar')}
                >
                    <div className="text-white">
                        <i className="fas fa-plus"></i>
                    </div>
                </div>

                <div
                    className="bg-[#676767] hover:bg-[#E7901C] rounded-lg h-10 w-10 flex items-center justify-center cursor-pointer mt-4"
                    onClick={() => handleMenuClick('playlist')}
                >
                    <div className="text-white">
                        <i className="fas fa-music"></i>
                    </div>

                </div>

            </div>
        </div>

    );
};

export default MenuLateral;
