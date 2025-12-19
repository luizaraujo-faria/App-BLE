import React, { createContext, useContext, useState } from 'react';

type ListContextData = {
    count: number;
    setCount: (value: number) => void;
};

const ListContext = createContext<ListContextData | null>(null);

export const ListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [count, setCount] = useState(0);

    return (
        <ListContext.Provider value={{ count, setCount }}>
            {children}
        </ListContext.Provider>
    );
};

export const useList = () => {
    const context = useContext(ListContext);

    if(!context) {
        throw new Error('useList must be used within a ListProvider');
    }
    return context;
};