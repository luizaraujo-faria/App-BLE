import { BleManager, Device, ScanMode, State } from 'react-native-ble-plx';
import type { Subscription } from 'react-native-ble-plx';
import { BluetoothDevice, ScanOptions } from './bleTypes';
// import * as Location from 'expo-location';
import { Buffer } from 'buffer';
import { checkPermissions, requestPermissions } from '../security/permissions';

type BleResult<T = void> = {
    ok: boolean;
    message?: string;
    data?: T;
};

class BleService {
    public manager: BleManager;
    private isScanning: boolean = false;
    private isMonitoring: boolean = false;
    private isDisconnecting: boolean = false;
    private monitorSubscription: Subscription | null = null;

    constructor(){
        this.manager = new BleManager();
    }

    // VERIFICA ESTADO DO BLUETOOTH
    private async isBluetoothOn(): Promise<boolean> {
        const state = await this.manager.state();
        return state === State.PoweredOn;
    }

    // VERIFICA OU PEDE PRMISSÕES
    private async ensureReady(): Promise<BleResult> {
        const permissionCheck = await checkPermissions();

        if (!permissionCheck.granted) {
            const request = await requestPermissions();

            if (!request.granted) {
                return {
                    ok: false,
                    message: request.message ?? 'Permissões BLE não concedidas',
                };
            }
        }

        const bluetoothOn = await this.isBluetoothOn();
        if (!bluetoothOn) {
            return {
                ok: false,
                message: 'Bluetooth está desligado',
            };
        }

        return { ok: true };
    }

    // INICIALIZA O BLE
    public async initialize(): Promise<BleResult> {
        try{
            return await this.ensureReady();
        } 
        catch (err: any) {
            return {
                ok: false,
                message: err.message ?? 'Erro inesperado ao inicializar BLE',
            };
        }
    }

    // Escanear dispositivos
    async scanForDevices(
        onDeviceFound: (device: BluetoothDevice) => void,
        options: ScanOptions = {},
    ): Promise<BleResult> {

        if (this.isScanning) {
            return { ok: false, message: 'Scan já está em execução' };
        }

        const ready = await this.ensureReady();
        if (!ready.ok) return ready;

        this.isScanning = true;

        try {
            this.manager.startDeviceScan(
                null,
                {
                    allowDuplicates: options.allowDuplicates ?? false,
                    scanMode: options.scanMode ?? ScanMode.LowLatency,
                },
                (err, device) => {
                    if (err) {
                        this.stopScan();
                        console.error(err.message);
                        return;
                    }

                    if (device) {
                        onDeviceFound(this.mapDeviceToBluetoothDevice(device));
                    }
                },
            );

            return { ok: true };
        } 
        catch (err: any) {
            this.isScanning = false;
            return {
                ok: false,
                message: err.message ?? 'Erro ao iniciar scan BLE',
            };
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
    async connectToDevice(deviceId: string): Promise<BleResult<Device | void>> {
        const ready = await this.ensureReady();
        if (!ready.ok) return ready;

        try {
            const device = await this.manager.connectToDevice(deviceId);
            await this.discoverDeviceServices(device);

            return { ok: true, data: device };
        } 
        catch (err: any) {
            return {
                ok: false,
                message: err.message ?? 'Falha ao conectar ao dispositivo',
            };
        }
    }

    // Desconectar-se de um dispositivo
    async disconnectDevice(device: BluetoothDevice): Promise<void> {

        if(this.isDisconnecting) {
            console.log('[BLE] Desconexão já em andamento - ignorando');
            return;
        }

        this.isDisconnecting = true;

        try{
            this.stopNotification();

            await new Promise(resolve => setTimeout(resolve, 300));

            const isConnected = await this.manager.isDeviceConnected(device.id);
            if(isConnected){
                console.log(`\n Desconectando do dispositivo: ${device.name}...`);
                await this.manager.cancelDeviceConnection(device.id);
                console.log(`[BLE] Desconectado de: ${device.name}\n`);
            }
        }
        catch(err: any){
            console.error('[ERRO] Falha Ao Desconectar-se! ', err.message);
        }
        finally{
            this.isDisconnecting = false;
        }
    }

    // Ler caracteristica
    async readCharacteristic(
        deviceId: string,
        serviceUUID: string,
        characteristicUUID: string,
    ): Promise<BleResult<string | null | void>> {

        const ready = await this.ensureReady();
        if (!ready.ok) return ready;

        try {
            const characteristic =
            await this.manager.readCharacteristicForDevice(
                deviceId,
                serviceUUID,
                characteristicUUID,
            );

            return { ok: true, data: characteristic.value };
        } 
        catch (err: any) {
            return {
                ok: false,
                message: err.message ?? 'Erro ao ler característica BLE',
            };
        }
    }
    // Escrever caracteristicas
    async writeCharacteristic(
        deviceId: string,
        serviceUUID: string,
        characteristicUUID: string,
        value: string | Uint8Array,
    ): Promise<BleResult> {

        const ready = await this.ensureReady();
        if (!ready.ok) return ready;

        try {
            const valueToSend =
            typeof value === 'string' && value.includes('\n')
                ? btoa(unescape(encodeURIComponent(value)))
                : (value as string);

            await this.manager.writeCharacteristicWithResponseForDevice(
                deviceId,
                serviceUUID,
                characteristicUUID,
                valueToSend,
            );

            return { ok: true };
        } 
        catch (err: any) {
            return {
                ok: false,
                message: err.message ?? 'Erro ao escrever característica BLE',
            };
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
        if(this.monitorSubscription){
            console.log('[BLE] Monitor de Notificações Ativo - Ignorando...\n');
            return;
        }

        this.isMonitoring = true;

        this.monitorSubscription = this.manager.monitorCharacteristicForDevice(
            deviceId,
            serviceUUID,
            characteristicUUID,
            (err, characteristic) => {

                if(!this.isMonitoring) return;

                if(err){
                    console.log('[ERRO] Falha no Monitor de Notificações:', err.message);
                    return;
                }

                if(!characteristic?.value) return;

                const decoded = Buffer
                    .from(characteristic.value, 'base64')
                    .toString('utf8');

                onData(decoded);
            },
        );
        console.log('[BLE] Monitor iniciado');
    }

    // stopNotification
    stopNotification(){

        if(!this.monitorSubscription){
            console.log('[BLE] Monitor já parado');
            return;
        }

        console.log('[BLE] Parando Monitoramento De Notificações BLE');

        try{
            this.isMonitoring = false;
            this.monitorSubscription.remove();
        } 
        catch (err: any) {
            console.log('[BLE] Cancel ignorado:', err.message);
        }
        finally{
            this.monitorSubscription = null;
        }
    }

    // Limpar rescursos 
    destroy(): void {
        console.log('[BLE] Destroy BLE Manager');

        try {
            this.stopNotification();
            this.stopScan();
        } 
        catch { /* empty */ }

        this.manager.destroy();
    }
}

export const bleService = new BleService();