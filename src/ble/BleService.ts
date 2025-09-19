import { BleManager, Device, ScanMode, State } from 'react-native-ble-plx';
import { BluetoothDevice, ScanOptions } from './bleTypes';

class BleService {
    private manager: BleManager;
    private isScanning: boolean = false;

    constructor(){
        this.manager = new BleManager();
    }

    // Inicializando o BLE
    async initialize(): Promise<boolean> {

        try{
            const state = await this.manager.state();
            console.log('BLE State: ', state);

            return state === State.PoweredOn;
        }
        catch(err: any){
            console.error('Falha ao inicializar o BLE! ', err);
            return false;
        }
    }

    // Escanear dispositivos
    async scanForDevices(
        onDeviceFound: (device: BluetoothDevice) => void,
        options: ScanOptions = {}
    ): Promise<void> {

        if(this.isScanning){ console.log('Scan efetuado.'); return; }

        this.isScanning = true;

        try{
            this.manager.startDeviceScan(
                null,
                {
                    allowDuplicates: options.allowDuplicates || false,
                    scanMode: options.scanMode || ScanMode.LowLatency,
                },
                (err, device) => {
                    if(err){ 
                        console.error('Erro no scan! ', err);
                        this.stopScan();
                        return;
                    }

                    if(device){ onDeviceFound(this.mapDeviceToBluetoothDevice(device)); }
                }
            );
        }
        catch(err: any){
            console.error('Falha ao iniciar scan! ', err);
            this.isScanning = false;
        }
    }

    // Parar o scan
    stopScan(): void {
        if(this.isScanning){
            this.manager.stopDeviceScan();
            this.isScanning = false;
        }
    }

    // Conectar a um dispositivo
    async connectToDevice(deviceId: string): Promise<Device> {

        try{
            const device = await this.manager.connectToDevice(deviceId);
            await device.discoverAllServicesAndCharacteristics();
            return device; 
        }
        catch(err: any){
            console.error('Falha ao conectar-se a um dispositivo! ', err);
            throw err;
        }
    }

    // Desconectar-se de um dispositivo
    async disconnectDevice(deviceId: string): Promise<void> {

        try{
            await this.manager.cancelDeviceConnection(deviceId);
        }
        catch(err: any){
            console.error('Falha ao desconectar-se! ', err);
        }
    }

    // Ler caracteristica
    async readCharacteristic(
        deviceId: string,
        serviceUUID: string,
        characteristicUUID: string
    ): Promise<string | null> {

        try{
            const characteristic = await this.manager.readCharacteristicForDevice(
                deviceId,
                serviceUUID,
                characteristicUUID
            );

            return characteristic.value;
        }
        catch(err: any){
            console.error('Falha na leitura de caracteristicas! ', err);
            throw err;
        }
    }

    // Escrever caracteristicas
    async writeCharacteristic(
        deviceId: string,
        serviceUUID: string,
        characteristicUUID: string,
        value: string
    ): Promise<void> {

        try{
            await this.manager.writeCharacteristicWithResponseForDevice(
                deviceId,
                serviceUUID,
                characteristicUUID,
                value
            );
        }
        catch(err: any){
            console.error('Falha ao escrever caracteristicas! ', err);
            throw err;
        }
    }

    // Mapear dispositivo para nosso tipo
    private mapDeviceToBluetoothDevice(device: Device): BluetoothDevice {

        return {
            id: device.id,
            name: device.name,
            localName: device.localName,
            manufactureData: device.manufacturerData,
            serviceUUIDs: device.serviceUUIDs,
            rssi: device.rssi,
            mtu: device.mtu,
        };
    }

    // Limpar rescursos 
    destoy(): void {

        this.manager.destroy();
    }
}

export const bleService = new BleService();