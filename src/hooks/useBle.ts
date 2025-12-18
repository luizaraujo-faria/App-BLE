// src/hooks/useBle.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { BluetoothDevice } from '../ble/bleTypes';
import { bleService } from '../ble/BleService';
import { usePopup } from '../contexts/PopupContext';

export const useBle = () => {

    const { showPopup } = usePopup();

    const [devices, setDevices] = useState<BluetoothDevice[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [currentDevice, setCurrentDevice] = useState<BluetoothDevice | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [receivedData, setReceivedData] = useState<{ value: string, ts: number } | null>(null);

    const isConnectingRef = useRef(false);
    const DEFAULT_DEVICE = 'ESP32_FRID';

    // Inicialização
    useEffect(() => {

        let mounted = true;

        (async () => {

            try{
                const ok = await bleService.initialize();
                if (!ok && mounted) {
                    setError('Bluetooth indisponível!');
                    console.log('  Bluetooth indisponível!');
                } 
                else{
                    console.log('  Bluetooth inicializado e pronto');
                }
            } 
            catch(err: any){
                console.log('  Erro ao inicializar BLE:', err);
                showPopup('Erro Bluetooth', 'Falha ao inicializar Bluetooth BLE!');
                if(mounted) setError(`Falha ao inicializar BLE: ${err?.message ?? err}`);
            }
        })();

        return () => {
            mounted = false;
            bleService.stopScan();
        };
    }, [showPopup]);

    // Filtro de nomes
    const filterDeviceByName = useCallback((deviceName: string | null): boolean => {

        if(!deviceName) return false;
        const name = deviceName.trim();
        const invalidNames = [
            'unknown', 'dispositivo desconhecido', 'null', 'undefined',
            'dispositivo', 'device', '', ' ', 'unknown device',
        ];

        return !invalidNames.includes(name.toLowerCase()) && name.length > 0;
    }, []);

    // Parar scan
    const stopScan = useCallback(() => {
        bleService.stopScan();
        setIsScanning(false);
    }, []);

    // conectar com timeout
    const connectWithTimeout = useCallback((id: string, timeout = 7000) => {

        const connectPromise = bleService.connectToDevice(id);
        const timeoutPromise = new Promise<never>((_, reject) => {

            const t = setTimeout(() => {
                clearTimeout(t);
                reject(new Error('Timeout de conexão - 7 segundos'));
            }, timeout);
        });

        return Promise.race([connectPromise, timeoutPromise]);
    }, []);

    // Conectar a um dispositivo
    const connectToDevice = useCallback(async (deviceId: string, device: BluetoothDevice) => {

        if(isConnectingRef.current) return;
        isConnectingRef.current = true;
        setError(null);

        try{
            console.log(`  connectToDevice: iniciando conexão com ${deviceId}`);
            await connectWithTimeout(deviceId, 7000);
            showPopup('Aviso!', 'Conexão estabelecida com sucesso!');
            console.log('  connectToDevice: conexão estabelecida com sucesso');
            setIsConnected(true);
            setCurrentDevice(prev => prev ?? (devices.find(d => d.id === deviceId) || device));
        } 
        catch(err: any){
            console.log('  connectToDevice: erro ao conectar:', err);
            setError(`Falha ao conectar com o dispositivo! ${err?.message ?? err}`);
            throw err;
        } 
        finally{
            isConnectingRef.current = false;
            stopScan();
        }
    }, [connectWithTimeout, devices, showPopup, stopScan]);

    // Auto connect quando detectar dispositivo alvo
    const checkAndAutoConnect = useCallback((device: BluetoothDevice) => {

        if(isConnected || isConnectingRef.current) return;
        const isTargetDevice = device.name?.includes(DEFAULT_DEVICE);
        if(isTargetDevice){
            console.log(`  Dispositivo alvo encontrado: ${device.name}. Conectando automaticamente...`);
            connectToDevice(device.id, device).catch(err => {
                console.log('  Erro na auto conexão:', err);
            });
            stopScan();
        }
    }, [isConnected, connectToDevice, stopScan]);

    // Scan para dispositivos
    const scanDevices = useCallback(async () => {
        setError(null);
        setDevices([]);
        setIsScanning(true);

        try{
            bleService.scanForDevices((device) => {
                setIsScanning(true);
                if (!filterDeviceByName(device.name)) return;

                setDevices(prev => {
                    if (prev.find(d => d.id === device.id)) return prev;
                    const next = [...prev, device];
                    // tenta auto conectar
                    checkAndAutoConnect(device);
                    return next;
                });
            }, { allowDuplicates: false });
            console.log('  scanDevices: scan iniciado');
        } 
        catch(err: any){
            console.log('  scanDevices erro:', err);
            setError(`Erro no scan: ${err?.message ?? err}`);
            setIsScanning(false);
        }
    }, [checkAndAutoConnect, filterDeviceByName]);

    // Desconectar
    const disconnectDevice = useCallback(async (device: BluetoothDevice) => {
        try{
            // bleService.stopNotification();

            await new Promise(r => setTimeout(r, 150));

            await bleService.disconnectDevice(device);
            setIsConnected(false);
            setCurrentDevice(null);
            console.log('  disconnectDevice: desconectado');
        } 
        catch(err: any){
            console.log('  disconnectDevice erro:', err);  
            setError(`Falha ao desconectar do dispositivo! ${err?.message ?? err}`);
        }
    }, []);

    // Inicia leitura (notify)
    const startReading = useCallback((serviceUUID: string, characteristicUUID: string) => {
        console.log('   startReading chamada');
        console.log('   Serviço:', serviceUUID);
        console.log('   Característica:', characteristicUUID);
        console.log('   currentDevice:', currentDevice?.id ?? 'null');

        if(!currentDevice){
            console.log('  startReading: Nenhum dispositivo conectado!');
            return;
        }

        bleService.startNotification(
            currentDevice.id,
            serviceUUID,
            characteristicUUID,
            (data: string) => {
                console.log('  Valor recebido do bleService:', data);
                setReceivedData({ value: data, ts: Date.now() });
            },
        );
    }, [currentDevice]);

    // Limpa o estado dos itens recebidos
    const clearReceivedData = useCallback(() => {

        setReceivedData(null);
    }, []);

    // Para todas as funcionalidades possivelmente ativas
    const stopAll = useCallback(async () => {

        if(isScanning) stopScan();
        if(isConnected) await disconnectDevice(currentDevice!);

    }, [currentDevice, disconnectDevice, isConnected, isScanning, stopScan]);

    return {
        devices,
        isScanning,
        isConnected,
        currentDevice,
        error,
        receivedData,
        scanDevices,
        stopScan,
        connectToDevice,
        disconnectDevice,
        startReading,
        clearReceivedData,
        stopAll,
    };
};