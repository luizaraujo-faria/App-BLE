import React, { useEffect, useRef } from 'react';
import { createContext, useContext, ReactNode } from 'react';
import { useBle } from '../hooks/useBle';
import { BluetoothDevice } from '../ble/bleTypes';
import { useDeviceToggles } from '../hooks/useDeviceToogle';
import { usePopup } from './PopupContext';

interface BleContextType {
    devices: any[];
    isScanning: boolean;
    isConnected: boolean;
    currentDevice: any;
    error: string | null;
    receivedData: { value: string, ts: number } | null;
    scanDevices: () => void;
    stopScan: () => void;
    connectToDevice: (deviceId: string, device: BluetoothDevice) => Promise<any>;
    disconnectDevice: (device: BluetoothDevice) => Promise<void>;
    startReading: (serviceUUID: string, characteristicUUID: string) => void;
    clearReceivedData: () => void;
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

    const { isBluetoothOn, isLocationOn, ready } = useDeviceToggles();
    const { showPopup } = usePopup();
    const ble = useBle();
    const prevBleState = useRef<boolean | null>(null);
    
    // Monitora estado dos serviços para parar o BLE
    useEffect(() => {

        if(!ready) return;

        const bleEnabled = isBluetoothOn && isLocationOn;

        if(prevBleState.current === true && !bleEnabled){
            showPopup('Aviso', 'Bluetooth ou Localização desativados! Serviços de bluetooth parados.');
            ble.stopAll();
        }

        prevBleState.current = bleEnabled;

    }, [ble, isBluetoothOn, isLocationOn, ready, showPopup]);

    return (
        <BleContext.Provider value={ble}>
            {children}
        </BleContext.Provider>
    );
};