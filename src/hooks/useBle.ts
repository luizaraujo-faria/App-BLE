// src/hooks/useBle.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { BluetoothDevice } from '../ble/bleTypes';
import { bleService } from '../ble/BleService';
// import { usePopup } from '../contexts/PopupContext';

export const useBle = () => {

    // const { showPopup } = usePopup();

    const [devices, setDevices] = useState<BluetoothDevice[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [currentDevice, setCurrentDevice] = useState<BluetoothDevice | null>(null);
    const [bleMessage, setBleMessage] = useState<string | null>(null);
    const [receivedData, setReceivedData] = useState<{ value: string, ts: number } | null>(null);

    const isConnectingRef = useRef(false);
    const DEFAULT_DEVICE = 'Nutricao_ESP32';

    // Inicialização
    useEffect(() => {

        let mounted = true;

        (async () => {

            try{
                await bleService.initialize();
            } 
            catch(err: any){
                console.log('[ERRO] Erro ao inicializar BLE:', err.message);
                // showPopup('Erro no BLE', 'Falha ao inicializar Bluetooth BLE!');
                if(mounted) setBleMessage(`Falha ao inicializar BLE: ${err?.message ?? err}`);
            }
        })();

        return () => {
            mounted = false;
            bleService.stopScan();
        };
    }, []);

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
                reject(new Error('Tempo limite de conexão excedido!'));
            }, timeout);
        });

        return Promise.race([connectPromise, timeoutPromise]);
    }, []);

    // Conectar a um dispositivo
    const connectToDevice = useCallback(async (deviceId: string, device: BluetoothDevice) => {

        if(isConnectingRef.current) return;
        isConnectingRef.current = true;
        setBleMessage(null);

        try{
            await connectWithTimeout(deviceId, 7000);
            // showPopup('Aviso!', 'Conexão estabelecida com sucesso!');
            setBleMessage(`Conexão com ${device.name} estabelecida com sucesso!`);
            console.log('\n[BLE] Conexão Estabelecida Com sucesso!\n');
            setIsConnected(true);
            setCurrentDevice(prev => prev ?? (devices.find(d => d.id === deviceId) || device));
        } 
        catch(err: any){
            // showPopup('Erro no BLE', `Erro ao conectar-se com o dispositivo! ${err.message}`);
            setBleMessage(`Falha ao conectar com o dispositivo ${device.name}! ${err?.message}`);
            throw err;
        } 
        finally{
            isConnectingRef.current = false;
            stopScan();
        }
    }, [connectWithTimeout, devices, stopScan]);

    // Auto connect quando detectar dispositivo alvo
    const checkAndAutoConnect = useCallback((device: BluetoothDevice) => {

        if(isConnected || isConnectingRef.current) return;
        const isTargetDevice = device.name?.includes(DEFAULT_DEVICE);
        if(isTargetDevice){
            console.log(`\n[BLE] Dispositivo alvo encontrado: ${device.name}. Conectando automaticamente...\n`);
            connectToDevice(device.id, device).catch(err => {
                setBleMessage(`Falha ao conectar-se com o dispositivo alvo ${device.name}! ${err.message}`);
                // showPopup('Erro no BLE', `Erro ao conectar-se com o dispositivo alvo! ${err.message}`);
            });
            stopScan();
        }
    }, [isConnected, connectToDevice, stopScan]);

    // Scan para dispositivos
    const scanDevices = useCallback(async () => {
        setBleMessage(null);
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
        } 
        catch(err: any){
            // showPopup('Erro BLE', `Erro ao buscar dispositivos! ${err.message}`);
            setBleMessage(`Falha no scan: ${err?.message ?? err}`);
            setIsScanning(false);
        }
    }, [checkAndAutoConnect, filterDeviceByName]);

    // Desconectar
    const disconnectDevice = useCallback(async (device: BluetoothDevice) => {
        try{
            bleService.stopNotification();

            await new Promise(r => setTimeout(r, 150));

            await bleService.disconnectDevice(device);
            setIsConnected(false);
            setCurrentDevice(null);
            setBleMessage(`Desconectado de ${device.name} com sucesso!`);
        } 
        catch(err: any){
            // showPopup('Erro no BLE', `Erro ao desconectar-se! ${err.message}`);
            setBleMessage(`Falha ao desconectar do dispositivo ${device.name}! ${err?.message}`);
        }
    }, []);

    // Inicia leitura (notify)
    const startReading = useCallback((serviceUUID: string, characteristicUUID: string) => {
        console.log('\n[BLE] Monitor de Notificações Inicializado!\n');
        // console.log('   Serviço:', serviceUUID);
        // console.log('   Característica:', characteristicUUID);
        // console.log('   currentDevice:', currentDevice?.id ?? 'null');

        if(!currentDevice){
            console.log('\n[ERRO] startReading: Nenhum dispositivo conectado!\n');
            return;
        }

        bleService.startNotification(
            currentDevice.id,
            serviceUUID,
            characteristicUUID,
            (data: string) => {
                console.log('\n[BLE] Valor recebido do bleService:', data);
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
        bleMessage,
        receivedData,
        scanDevices,
        stopScan,
        connectToDevice,
        disconnectDevice,
        startReading,
        clearReceivedData,
        stopAll,
        setBleMessage,
    };
};