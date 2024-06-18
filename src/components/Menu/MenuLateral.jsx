import React, { useState, useEffect } from 'react';
import { ToggleMenuSvg } from '../Svgs';

const MenuLateral = ({ setContent }) => {
    const [expanded, setExpanded] = useState(false);
    const [showText, setShowText] = useState(false);

    const handleMenuClick = (contentType) => {
        setContent(contentType);
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (expanded) {
            const timer = setTimeout(() => setShowText(true), 300); // Show text after 0.5s
            return () => clearTimeout(timer); // Cleanup timer
        } else {
            setShowText(false);
        }
    }, [expanded]);

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
                    {expanded && <span className="ml-2 font-bold transition-opacity duration-500">Menu</span>}
                </div>

                <div className='flex items-center mt-4 rounded-lg' onClick={() => handleMenuClick('adicionar')}
                >
                    <div
                        className="bg-[#262626] hover:bg-[#2C6BB2] rounded-lg h-10 w-10 flex items-center justify-center cursor-pointer"
                    >
                        <div className="text-white">
                            <i className="fas fa-plus"></i>
                        </div>
                    </div>
                    {showText && (
                        <span className="ml-2 font-bold transition-opacity duration-500 cursor-pointer">
                            Adicionar Músicas
                        </span>
                    )}                </div>

                <div className='flex items-center mt-4' onClick={() => handleMenuClick('playlist')}>
                    <div
                        className="bg-[#262626] hover:bg-[#E7901C] rounded-lg h-10 w-10 flex items-center justify-center cursor-pointer"
                    >
                        <div className="text-white">
                            <i className="fas fa-music"></i>
                        </div>
                    </div>
                    {showText && <span className="ml-2 font-bold transition-opacity duration-500 cursor-pointer">Suas Playlists</span>}
                </div>

            </div>
        </div>
    );
};

export default MenuLateral;
