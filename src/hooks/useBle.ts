import { useState, useEffect, useCallback, useRef } from 'react';
import { BluetoothDevice } from '../ble/bleTypes';
import { bleService } from '../ble/BleService';
import { Alert } from 'react-native';

export const useBle = () => {
    
    const [devices, setDevices] = useState<BluetoothDevice[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [currentDevice, setCurrentDevice] = useState<BluetoothDevice | null>(null);
    const [error, setError] = useState<string | null>(null);

    let isConnectingRef = useRef(false);

    const DEFAULT_DEVICE = 'ESP32_BLE_Display';

    // Inicializar o BLE
    useEffect(() => {

        const initBle = async () => {
            try{
                const isInitialized = await bleService.initialize();
                if(!isInitialized){ setError('\nBluetooth indisponível!'); }
            }
            catch(err: any){
                Alert.alert('Erro Bluetooth', 'Falha ao inicializar Bluetooth BLE!');
                setError(`Falha ao incializar Bluetooth BLE! ${err.message}`);
            }
        };

        initBle();

        return () => {
            bleService.stopScan();
        };
    }, []);

    // Função de filtro para nomes válidos
    const filterDeviceByName = useCallback((deviceName: string | null): boolean => {
        if (!deviceName) return false;
        
        const name = deviceName.trim();
        
        const invalidNames: string[] = [
            'unknown',
            'dispositivo desconhecido',
            'null',
            'undefined',
            'dispositivo',
            'device',
            '',
            ' ',
            'unknown device',
        ];

        return !invalidNames.includes(name.toLowerCase()) && name.length > 0;
    }, []);

    // Escanear dispositivos
    const scanDevices = useCallback(async () => {
        
        setError(null);
        setDevices([]);

        bleService.scanForDevices((device) => {
            setIsScanning(true);

            if(filterDeviceByName(device.name)){

                setDevices(prev => {
                    // Evita duplicatas
                    if(!prev.find(d => d.id === device.id)){
                        const newDevices = [...prev, device];

                        checkAndAutoConnect(device);

                        return newDevices;
                    }
                    return prev;
                });
            }
        }, {
            allowDuplicates: false,
        });
    }, [filterDeviceByName]);

    // Parar scan
    const stopScan = useCallback(() => {

        bleService.stopScan();
        setIsScanning(false);
    }, []);

    // Conectar a um dispositivo
    const connectToDevice = useCallback(async (deviceId: string, device: BluetoothDevice) => {

        if(isConnectingRef.current) return;

        try{
            isConnectingRef.current = true;

            setError(null);
      
            const connectWithTimeout = async (id: string, timeout = 7000) => {

                return new Promise<void>((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error('Timeout de conexão - 7 segundos'));
                    }, timeout);

                    try {
                        bleService.connectToDevice(id);
                        setIsScanning(false);
                        clearTimeout(timeoutId);
                        resolve();
                    } 
                    catch(err: any){
                        clearTimeout(timeoutId);
                        reject(err.message);
                    }
                });
            };

            // Usar a conexão com timeout
            await connectWithTimeout(deviceId);
      
            setIsConnected(true);
            setCurrentDevice(devices.find(d => d.id === deviceId) || device);
            isConnectingRef.current = false;
            return deviceId; // ou retorne o que você precisa

        } 
        catch(err: any){
            setError(`Falha ao conectar com o dispositivo! ${err.message}`);
            throw err;
        }
    }, [devices]);

    // Verificar se é o ESP32_BLE e conectar automaticamente
    const checkAndAutoConnect = useCallback((device: BluetoothDevice) => {
        // Se já está conectado ou tentando conectar, não faz nada
        if(isConnected || isConnectingRef.current) return;
        
        // Verifica se é o ESP32_BLE (comparação case insensitive)
        const isTargetDevice = device.name?.includes(DEFAULT_DEVICE);
        
        if(isTargetDevice){

            console.log(`Dispositivo alvo encontrado: ${device.name}. Conectando automaticamente...`);
            connectToDevice(device.id, device);
        }
    }, [isConnected, connectToDevice]);

    // Desconectar do dispositivo
    const disconnectDevice = useCallback(async (device: BluetoothDevice) => {

        try{
            await bleService.disconnectDevice(device);
            setIsConnected(false);
            setCurrentDevice(null);  
        }
        catch(err: any){
            setError(`\nFalha ao desconectar do dispositivo! ${err.message}`);
        }
    }, []);

    return {
        devices,
        isScanning,
        isConnected,
        currentDevice,
        error,
        scanDevices,
        stopScan,
        connectToDevice,
        disconnectDevice,
    };
};