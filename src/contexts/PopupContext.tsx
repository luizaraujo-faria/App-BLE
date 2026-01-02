import React, { createContext, useContext, useState, ReactNode } from 'react';
import Popup from '../components/Popup';

interface PopupContextData {
    showPopup: (title: string, message: string) => void;
    hidePopup: () => void;
}

const PopupContext = createContext<PopupContextData>({} as PopupContextData);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    function showPopup(t: string, m: string) {
        setTitle(t);
        setMessage(m);
        setVisible(true);
    }

    function hidePopup() {
        setVisible(false);
    }

    return (
        <PopupContext.Provider value={{ showPopup, hidePopup }}>
            {children}

            {/* Renderiza o popup global */}
            <Popup
                title={title}
                message={message}
                visible={visible}
                onClose={hidePopup}
            />
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    return useContext(PopupContext);
};