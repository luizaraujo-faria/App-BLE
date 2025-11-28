import React from 'react';
import { createContext, useContext, ReactNode } from 'react';
import { useBle } from '../hooks/useBle';
import { BluetoothDevice } from '../ble/bleTypes';

interface BleContextType {
    devices: any[];
    isScanning: boolean;
    isConnected: boolean;
    currentDevice: any;
    error: string | null;
    receivedData: string | null;
    scanDevices: () => void;
    stopScan: () => void;
    connectToDevice: (deviceId: string, device: BluetoothDevice) => Promise<any>;
    disconnectDevice: (device: BluetoothDevice) => Promise<void>;
    startReading: (serviceUUID: string, characteristicUUID: string) => void;
}

const BleContext = createContext<BleContextType | undefined>(undefined);

export const useBleContext = () => {

    const context = useContext(BleContext);
    if(!context){
        throw new Error('useBleContext deve ser utilizado dentro de um BleProvider');
    }
    return context;
};

interface BleProviderProps {
    children: ReactNode;
}

export const BleProvider = ({ children }: BleProviderProps) => {

    const ble = useBle();

    return (
        <BleContext.Provider value={ble}>
            {children}
        </BleContext.Provider>
    );
};