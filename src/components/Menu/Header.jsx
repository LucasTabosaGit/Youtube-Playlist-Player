import React, { useState } from "react";

const Header = ({ setContent, goBack, goForward, canGoBack, canGoForward }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        const query = encodeURIComponent(searchTerm.trim());
        if (query) {
            const url = `https://www.youtube.com/results?search_query=${query}`;
            window.open(url, "_blank");
        } else {
            console.log("Campo de pesquisa vazio");
        }
    };

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleInicioClick = () => {
        setContent('inicio');
    };

    return (
        <div className="header bg-black text-white flex items-center justify-between mb-0.3 mt-1">
            <div className="flex items-center p-1 justify-center ">
                
                <div style={{ cursor: 'pointer' }} 
                className="items-center justify-center p-5 w-16 py-2 rounded-md bg-[#171717] hover:bg-[#4F0D3B]" onClick={handleInicioClick}>
                    <i className="fas fa-home text-white"></i>
                </div>

                
                <div className="flex items-center justify-center ml-2">
                    <button onClick={goBack} disabled={!canGoBack} style={{cursor: 'pointer', height: '40px', width: '40px'  }} 
                    className="flex items-center justify-center mr-2 p-2 w-8 py-2 rounded-md bg-[#171717] hover:bg-[#262626]">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <button onClick={goForward} disabled={!canGoForward}style={{ cursor: 'pointer', height: '40px', width: '40px' }} 
                    className="flex items-center justify-center p-2 w-8 py-2 rounded-md bg-[#171717] hover:bg-[#262626]">
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>

                <div style={{ width: '340px', backgroundColor: '#171717', marginLeft: '10px' }} 
                className="search-bar rounded-lg px-4 py-2 flex items-center">
                    <span className="text-gray-300 mr-3">
                        <i className="fas fa-search"></i>
                    </span>
                    <input
                        type="text"
                        placeholder="Procurar Vídeo no Youtube"
                        style={{ backgroundColor: '#171717' }}
                        className="bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <button onClick={handleSearch} className="text-white ml-2">
                        Buscar
                    </button>
                </div>
            </div>
            <div className="flex-grow"></div>

        </div>
    );
};

export default Header;
