import React from "react";

const Header = () => {
    return (
        <div className="header bg-black text-white flex items-center justify-between h-12 ">
            
            
            <div className="flex items-center p-1">
                {/* Ícone da casa */}
                <div style={{ backgroundColor: '#171717' }} className="p5 w-16 px-5 py-2 mr-4 rounded-md">
                    <i style={{ marginLeft: '2px' }}className="fas fa-home text-white"></i>
                </div>
                {/* Barra de pesquisa */}
                <div style={{ width: '400px', backgroundColor: '#171717', marginLeft: '10px' }} className="search-bar  rounded-full px-4 py-2 flex items-center">
                    <span className="text-gray-300 mr-2">
                        <i className="fas fa-search"></i>
                    </span>
                    <input type="text" placeholder="Pesquisar..." style={{  backgroundColor: '#171717' }} className="bg-gray-700 text-gray-300 placeholder-gray-500 focus:outline-none" />
                </div>
            </div>
            {/* Espaço para manter a barra de pesquisa centralizada */}
            <div className="flex-grow"></div>
        </div>
    );
};

export default Header;
