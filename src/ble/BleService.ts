import { BleManager, Device, ScanMode, State } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import { BluetoothDevice, ScanOptions } from './bleTypes';
import * as Location from 'expo-location';
import { Buffer } from 'buffer';

class BleService {
    public manager: BleManager;
    private isScanning: boolean = false;
    private isMonitoring: boolean = false;
    private notifyTransactionId: string | null = null;

    constructor(){
        this.manager = new BleManager();
    }

    // Solicitar permissões em runtime
    private async requestPermissions(): Promise<boolean> {
        if(Platform.OS !== 'android') {
            return true;
        }

        try{
            const state = await this.manager.state();
      
            if(state === State.PoweredOn) {
                return true;
            }
            else{
                return false;
            }
        } 
        catch (err: any) {
            console.error('[ERRO] Erro ao verificar estado Bluetooth:', err.message);
            return false;
        }
    }

    private async checkPermissions(): Promise<boolean> {
        try{
            const state = await this.manager.state();
            const locationState = Location.PermissionStatus.GRANTED;
            return (state === State.PoweredOn && locationState === 'granted');
        } 
        catch (err: any){
            console.error('[ERRO] Erro ao verificar permissões:', err.message);
            return false;
        }
    }

    public async initialize(): Promise<boolean> {
        try {
            const state = await this.manager.state();
            const locationState = await Location.hasServicesEnabledAsync();
      
            if (state !== State.PoweredOn) {
                console.log('Bluetooth não está ligado. Estado:', state);
                return false;
            }

            if(locationState !== true){
                console.log(`Localização não esta ligada, Estado: ${locationState}`);
                return false;
            }

            return true;
        } 
        catch(err: any) {
            console.error('[ERRO] Falha ao Incializar BLE:', err.message);
            return false;
        }
    }

    // Escanear dispositivos
    async scanForDevices(

        onDeviceFound: (device: BluetoothDevice) => void,
        options: ScanOptions = {},

    ): Promise<void> {

        if(this.isScanning){ console.log('[BLE] Scan efetuado.\n'); return; }

        const hasPermissions = await this.checkPermissions();
        if(!hasPermissions){
            const granted = await this.requestPermissions();
            if(!granted){
                console.error('Permissões negadas para escan BLE');
                return;
            }
        }

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
                        console.error('[ERRO] Erro No Scan! ', err.message);
                        this.stopScan();
                        return;
                    }

                    if(device){ onDeviceFound(this.mapDeviceToBluetoothDevice(device)); }
                },
            );
        }
        catch(err: any){
            console.error('[ERRO] Falha ao Iniciar Scan! ', err.message);
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

    // Descobrir serviços do dispositivo
    async discoverDeviceServices(device: Device): Promise<Device> {

        try {
            console.log('\nIniciando descoberta de serviços para dispositivo:', device.name);
            
            await device.discoverAllServicesAndCharacteristics();
            
            // Lista todos os serviços
            const services = await device.services();
            console.log('\n[BLE] SERVIÇOS ENCONTRADOS:');
            
            for(const service of services){
                console.log(`\n Serviço UUID: ${service.uuid}`);
                console.log(`   Tipo: ${service.isPrimary ? 'Primário' : 'Secundário'}`);
                
                // Lista características deste serviço
                const characteristics = await service.characteristics();
                console.log(`   Características (${characteristics.length}):`);
                
                for (const char of characteristics) {
                    console.log(`   └─ UUID: ${char.uuid}`);
                    
                    const properties = [
                        char.isReadable ? 'Leitura' : '',
                        char.isWritableWithResponse ? 'Escrita com resposta' : '',
                        char.isWritableWithoutResponse ? 'Escrita sem resposta' : '',
                        char.isNotifiable ? 'Notificável' : '',
                        char.isIndicatable ? 'Indicável' : '',
                    ].filter(Boolean).join(', ') || 'Nenhuma';
                    
                    console.log(`      - Propriedades: ${properties}`);
                    console.log(`      - Valor: ${char.value || 'N/A'}`);
                    console.log(`      * É legível: ${char.isReadable}`);
                    console.log(`      * É gravável: ${char.isWritableWithResponse || char.isWritableWithoutResponse}\n`);
                }
            }
            
            return device;
        }
        catch(err: any){
            console.error('[ERRO] Erro ao Descobrir Serviços:', err.message);
            throw err;
        }
    }

    // Conectar a um dispositivo
    async connectToDevice(deviceId: string): Promise<Device> {

        try{
            const hasPermissions = await this.checkPermissions();
            if (!hasPermissions) {
                const granted = await this.requestPermissions();
                if (!granted) {
                    throw new Error('Permissões negadas para conexão BLE');
                }
            }

            const device = await this.manager.connectToDevice(deviceId);
            await this.discoverDeviceServices(device);

            return device; 
        }
        catch(err: any){
            console.error('[ERRO] Falha ao Conectar-se A Um Dispositivo! ', err.message);
            throw err;
        }
    }

    // Desconectar-se de um dispositivo
    async disconnectDevice(device: BluetoothDevice): Promise<void> {

        try{
            if(this.isMonitoring) this.isMonitoring = false;
            if(this.notifyTransactionId) this.notifyTransactionId = null;

            console.log(`\n Desconectando do dispositivo: ${device.name}...`);
            await this.manager.cancelDeviceConnection(device.id);
            console.log(`[BLE] Desconectado de: ${device.name}\n`);
        }
        catch(err: any){
            console.error('[ERRO] Falha Ao Desconectar-se! ', err.message);
        }
    }

    // Ler caracteristica
    async readCharacteristic(
        deviceId: string,
        serviceUUID: string,
        characteristicUUID: string,
    ): Promise<string | null> {

        try{
            const hasPermissions = await this.checkPermissions();
            if (!hasPermissions) {
                const granted = await this.requestPermissions();
                if (!granted) {
                    throw new Error('Permissões negadas para leitura BLE');
                }
            }

            const characteristic = await this.manager.readCharacteristicForDevice(
                deviceId,
                serviceUUID,
                characteristicUUID,
            );

            return characteristic.value;
        }
        catch(err: any){
            console.error('[ERRO] Falha na Leitura de Caracteristicas! ', err);
            throw err;
        }
    }

    // Escrever caracteristicas
    async writeCharacteristic(
        deviceId: string,
        serviceUUID: string,
        characteristicUUID: string,
        value: string | Uint8Array,
    ): Promise<void> {
        try {
            let valueToSend: string;

            // Se for string com \n, converter para base64
            if (typeof value === 'string' && value.includes('\n')) {
                valueToSend = btoa(unescape(encodeURIComponent(value)));
            } 
            else{
                valueToSend = value as string;
            }

            const hasPermissions = await this.checkPermissions();
            if (!hasPermissions) {
                const granted = await this.requestPermissions();
                if (!granted) {
                    throw new Error('Permissões negadas para escrita BLE');
                }
            }

            await this.manager.writeCharacteristicWithResponseForDevice(
                deviceId,
                serviceUUID,
                characteristicUUID,
                valueToSend,
            );

        } 
        catch(err: any){
            console.error('[ERRO] Falha Ao Escrever característica:', {
                error: err,
                message: err.message,
                errorCode: err.errorCode,
            });
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

    // Ativar notificação
    startNotification(
        deviceId: string,
        serviceUUID: string,
        characteristicUUID: string,
        onData: (data: string) => void,
    ) {
        if(this.isMonitoring){
            console.log('[BLE] Monitor de Notificações Ativo - Ignorando...\n');
            return;
        }

        const transactionId = `BLE_MONITOR_${Date.now()}`;
        this.notifyTransactionId = transactionId;
        this.isMonitoring = true;

        this.manager.monitorCharacteristicForDevice(
            deviceId,
            serviceUUID,
            characteristicUUID,
            (err, characteristic) => {
                if(err){
                    console.log('[ERRO] Falha no Monitor de Notificações:', err.message);

                    // this.stopNotification();
                    this.isMonitoring = false;
                    this.notifyTransactionId = null;

                    return;
                }

                if(!characteristic?.value) return;

                const decoded = Buffer
                    .from(characteristic.value, 'base64')
                    .toString('utf8');

                onData(decoded);
            },
            transactionId,
        );
    }

    // stopNotification
    stopNotification(){

        console.log('[BLE] Parando Monitoramento De Notificações BLE');

        if(!this.isMonitoring || !this.notifyTransactionId){
            console.log('[BLE] Monitor já parado');
            return;
        }

        // const tx = this.notifyTransactionId;

        this.isMonitoring = false;
        this.notifyTransactionId = null;

        try{
            // this.manager.cancelTransaction(tx);
        } 
        catch(err: any) {
            console.log(`[ERRO] Cancelamento de Notificações Ignorado! ${err.message}`);
        }
    }

    // Limpar rescursos 
    destoy(): void {

        this.manager.destroy();
    }
}

export const bleService = new BleService();