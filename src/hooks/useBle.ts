import { useState, useEffect, useCallback } from 'react';
import { BluetoothDevice } from '../ble/bleTypes';
import { bleService } from '../ble/BleService';

export const useBle = () => {
    
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<BluetoothDevice | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Inicializar o BLE
  useEffect(() => {

    const initBle = async () => {
      try{
        const isInitialized = await bleService.initialize();
        if(!isInitialized){ setError('Bluetooth indisponível!'); }
      }
      catch(err: any){
        setError(`Falha ao incializar Bluetooth BLE! ${err.message}`);
      }
    };

    initBle();

    return () => {
      bleService.stopScan();
    };
  }, []);

  // Escanear dispositivos
  const scanDevices = useCallback(async () => {
        
    setError(null);
    setIsScanning(true);
    setDevices([]);

    bleService.scanForDevices((device) => {

      setDevices(prev => {
        // Evita duplicatas
        if(!prev.find(d => d.id === device.id)){
          return [...prev, device];
        }
        return prev;
      });
    }, {
      allowDuplicates: false,
    });
  }, []);

  // Parar scan
  const stopScan = useCallback(() => {

    bleService.stopScan();
    setIsScanning(false);
  }, []);

  // Conectar a um dispositivo
  const connectToDevice = useCallback(async (deviceId: string) => {

    try{
      setError(null);
      
      // ADICIONAR ESTA FUNÇÃO DE TIMEOUT
      const connectWithTimeout = async (id: string, timeout = 7000) => {

        return new Promise<void>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Timeout de conexão - 7 segundos'));
          }, timeout);

          try {
            bleService.connectToDevice(id);
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
      setCurrentDevice(devices.find(d => d.id === deviceId) || null);
      return deviceId; // ou retorne o que você precisa

    } 
    catch(err: any){
      setError(`Falha ao conectar com o dispositivo! ${err.message}`);
      throw err;
    }
  }, [devices]);

  // Desconectar do dispositivo
  const disconnectDevice = useCallback(async (device: BluetoothDevice) => {

    try{
      await bleService.disconnectDevice(device);
      setIsConnected(false);
      setCurrentDevice(null);  
    }
    catch(err: any){
      setError(`Falha ao desconectar do dispositivo! ${err.message}`);
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