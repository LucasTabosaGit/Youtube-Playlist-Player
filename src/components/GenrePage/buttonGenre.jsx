import React, { useState } from 'react';

export default function ButtonGenre() {
    const [showForm, setShowForm] = useState(false);
    const [genreName, setGenreName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#ff0000'); // Valor padrão inicial

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            title: genreName,
            color: selectedColor
        };

        try {
            const response = await fetch('/api/addgenre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.alert('Adicionado com sucesso');
                setGenreName('');
                setSelectedColor('#ff0000');
                window.location.reload();
            } else {
                console.error('Erro ao enviar os dados para a API:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar os dados para a API:', error);
        }
    };

    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

    const colorOptions = [
        { value: '#5C2D92', label: 'Roxo' },
        { value: '#27B975', label: 'Verde' },
        { value: '#333333', label: 'Cinza' },
        { value: '#072566', label: 'Azul' },
        { value: '#94186D', label: 'Magenta' },
        { value: '#E8911C', label: 'Laranja' },
        { value: '#EE5700', label: 'Laranja Esc.' },
        { value: '#C11925', label: 'Vermelho' }
    ];

    return (
        <div style={{ backgroundColor: '#171717', display: 'flex', flexWrap: 'wrap' }}>
            <button style={{ height: '40px' }}

                className='text-white rounded-md bg-[#2F2F2F] px-2 py-1 font mx-6 mt-3 mb-2 hover:cursor-pointer hover:bg-[#14843B]'
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? 'Cancelar' : 'Adicionar Gênero'}
            </button>
            {showForm && (
                <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
                    <div className='mx-4'>
                        <label htmlFor="genreName">Gênero: </label>
                        <input
                            type="text"
                            id="genreName"
                            value={genreName}
                            onChange={(event) => setGenreName(event.target.value)}
                            required
                            style={{ height: '40px' }}
                            className='text-white rounded-md w-40 bg-[#2F2F2F] px-2 py-1 mt-3 mb-2 hover:bg-[#3F3F3F]'
                        />
                    </div>
                    <div>
                        <label htmlFor="color ">Cor: </label>
                        <select
                            id="color"
                            value={selectedColor}
                            onChange={handleColorChange}
                            style={{
                                backgroundColor: selectedColor,
                                color: 'white',
                                border: 'none',
                                padding: '0.5em',
                                borderRadius: '4px',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none'
                            }}
                            className='text-white rounded-md w-40 bg-[#2F2F2F] px-2 py-1 mt-3 mb-2 hover:bg-[#3F3F3F]'

                        >
                            {colorOptions.map((option, index) => (
                                <option key={index} value={option.value} style={{ backgroundColor: option.value }}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button style={{ maxHeight: '40px' }} className='mt-3 mb-2text-white rounded-md bg-[#2F2F2F] px-2 py-1 font mx-3 hover:cursor-pointer hover:bg-[#14843B]' type="submit">Adicionar</button>
                </form>
            )}
        </div>
    );
}
