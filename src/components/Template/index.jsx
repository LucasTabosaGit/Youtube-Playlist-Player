import React from 'react';
import Header from '../Menu/Header';
import MenuLateral from '../Menu/MenuLateral';
import AudioPlayer from '../Player/index2';

const Template = ({ children, content, setContent }) => {
    return (
        <>
            <Header content={content} setContent={setContent} />
            <div className='flex'>
                <MenuLateral content={content} setContent={setContent} />
                <div
                    style={{
                        maxHeight: '78.5vh',
                        overflowY: 'auto',
                        width: '100%',
                        marginTop: '5px',
                        marginLeft: '5px',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px'
                    }}
                >
                    {children}
                </div>
            </div>
            <AudioPlayer />
        </>
    );
};

export default Template;
