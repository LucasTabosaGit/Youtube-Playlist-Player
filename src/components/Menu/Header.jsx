import React, { useState } from "react";

const Header = ({ setContent }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        const query = encodeURIComponent(searchTerm.trim());
        if (query) {
            const url = `https://www.youtube.com/results?search_query=${query}`;
            window.open(url, "_blank");
        } else {
            // Lógica para tratamento de campo vazio, se necessário
            console.log("Campo de pesquisa vazio");
        }
    };

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleInicioClick = () => {
        setContent('inicio'); // Atualiza o estado 'content' para 'inicio'
    };

    return (
        <div className="header bg-black text-white flex items-center justify-between h-12">
            <div className="flex items-center p-1">
                <div style={{ backgroundColor: '#171717', cursor: 'pointer' }} className="p-5 w-16 px-5 py-2 rounded-md" onClick={handleInicioClick}>
                    <i className="fas fa-home text-white"></i>
                </div>
                <div style={{ width: '330px', backgroundColor: '#171717', marginLeft: '10px' }} className="search-bar rounded-lg px-4 py-2 flex items-center">
                    <span className="text-gray-300 mr-2">
                        <i className="fas fa-search"></i>
                    </span>
                    <input
                        type="text"
                        placeholder="Procurar Youtube Vídeo..."
                        style={{ backgroundColor: '#171717' }}
                        className="bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <button onClick={handleSearch} className="text-white">
                        Buscar
                    </button>
                </div>
            </div>
            <div className="flex-grow"></div>
        </div>
    );
};

export default Header;
