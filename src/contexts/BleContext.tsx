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
    bleMessage: string | null;
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

    const ble = useBle();

    const { isBluetoothOn, isLocationOn, ready } = useDeviceToggles();
    const { showPopup } = usePopup();
    
    const prevBleState = useRef<boolean | null>(null);

    const bleMessage: string | null = ble.bleMessage;
    
    // Monitora estado dos serviços para parar o BLE
    useEffect(() => {

        if(!ready) return;
        
        const bleEnabled = isBluetoothOn && isLocationOn;

        if(prevBleState.current === true && !bleEnabled){

            console.log('\n[BLE] Todos Serviços BLE Parados!\n');
            showPopup('Aviso', 'Bluetooth ou Localização desativados! Serviços de bluetooth parados.');
            ble.stopAll();
        }

        prevBleState.current = bleEnabled;

    }, [ble, isBluetoothOn, isLocationOn, ready, showPopup]);

    // useEffect(() => {
    //     if (!ready) return;

    //     const bleEnabled = isBluetoothOn && isLocationOn;

    //     if (bleEnabled) {

    //         console.log('\n[BLE] 🔥 Simulando recebimento de dados...\n');

    //         const fakeData = [
    //             { value: '12345', ts: Date.now() - 500000 },
    //             { value: '193235', ts: Date.now() - 850000 },
    //             { value: '78577', ts: Date.now() - 1500000 },
    //         ];

    //         fakeData.forEach((item, index) => {
    //             setTimeout(() => {
    //                 ble.setReceivedData(item); // precisa existir no seu hook
    //             }, index * 1000);
    //         });
    //     }

    // }, [isBluetoothOn, isLocationOn, ready]);

    useEffect(() => {

        if(!bleMessage) return;

        console.log('\n[BLE] Mensagem Capturada no Contexto!\n');
        showPopup('Mensagem do BLE!', bleMessage);
        ble.setBleMessage(null);

    }, [ble, bleMessage, showPopup]);

    // useEffect(() => {
    //     return () => {
    //         ble.shutdownBle();
    //     };
    // }, [ble]);

    return (
        <BleContext.Provider value={ble}>
            {children}
        </BleContext.Provider>
    );
};