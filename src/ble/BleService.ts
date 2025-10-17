import { BleManager, Device, ScanMode, State } from 'react-native-ble-plx';
import { Platform } from 'react-native';
import { BluetoothDevice, ScanOptions } from './bleTypes';

class BleService {
    private manager: BleManager;
    private isScanning: boolean = false;

    constructor(){
        this.manager = new BleManager();
    }

    // Solicitar permissões em runtime - FORMA CORRETA PARA EXPO
    private async requestPermissions(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            return true;
        }

        try {
            const state = await this.manager.state();
      
            if (state === State.PoweredOn) {
                return true;
            } else {
                // Para Android, apenas informa o usuário para ligar o Bluetooth
                console.log('Bluetooth desligado. Peça para o usuário ligar manualmente nas configurações.');
        
                // Você pode mostrar um alerta para o usuário aqui
                // Alert.alert('Bluetooth Desligado', 'Por favor, ligue o Bluetooth nas configurações do dispositivo');
        
                return false;
            }
        } catch (err: any) {
            console.error('Erro ao verificar estado Bluetooth:', err);
            return false;
        }
    }

    private async checkPermissions(): Promise<boolean> {
        try {
            const state = await this.manager.state();
            return state === State.PoweredOn;
        } catch (err: any) {
            console.error('Erro ao verificar permissões:', err);
            return false;
        }
    }

    public async initialize(): Promise<boolean> {
        try {
            const state = await this.manager.state();
      
            if (state !== State.PoweredOn) {
                console.log('Bluetooth não está ligado. Estado:', state);
                return false;
            }

            console.log('Bluetooth ligado e pronto para uso');
            return true;
        } catch (err: any) {
            console.error('Erro na inicialização BLE:', err);
            return false;
        }
    }

    // Escanear dispositivos
    async scanForDevices(
        onDeviceFound: (device: BluetoothDevice) => void,
        options: ScanOptions = {},
    ): Promise<void> {

        if(this.isScanning){ console.log('Scan efetuado.'); return; }

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
                        console.error('Erro no scan! ', err);
                        this.stopScan();
                        return;
                    }

                    if(device){ onDeviceFound(this.mapDeviceToBluetoothDevice(device)); }
                },
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

    // MÉTODO CORRIGIDO - Usando propriedades corretas 
    async discoverDeviceServices(deviceId: string): Promise<void> {
        try {
            console.log('🔍 Iniciando descoberta de serviços para dispositivo:', deviceId);
            
            // Conecta ao dispositivo (já deve estar conectado, mas garante)
            const device = await this.manager.connectToDevice(deviceId);
            console.log(' Conectado para descobrir serviços');
            
            // Descobre todos os serviços e características
            await device.discoverAllServicesAndCharacteristics();
            console.log(' Serviços descobertos');
            
            // Lista todos os serviços
            const services = await device.services();
            console.log('\n SERVIÇOS ENCONTRADOS:');
            
            for (const service of services) {
                console.log(`\n Serviço UUID: ${service.uuid}`);
                console.log(`   Tipo: ${service.isPrimary ? 'Primário' : 'Secundário'}`);
                
                // Lista características deste serviço
                const characteristics = await service.characteristics();
                console.log(`   Características (${characteristics.length}):`);
                
                for (const char of characteristics) {
                    console.log(`   └─ UUID: ${char.uuid}`);
                    
                    //  PROPRIEDADES CORRETAS DO react-native-ble-plx 
                    const properties = [
                        char.isReadable ? 'Leitura' : '',
                        char.isWritableWithResponse ? 'Escrita com resposta' : '',
                        char.isWritableWithoutResponse ? 'Escrita sem resposta' : '',
                        char.isNotifiable ? 'Notificável' : '',
                        char.isIndicatable ? 'Indicável' : '',
                    ].filter(Boolean).join(', ') || 'Nenhuma';
                    
                    console.log(`      Propriedades: ${properties}`);
                    console.log(`      Valor: ${char.value || 'N/A'}`);
                    console.log(`      É legível: ${char.isReadable}`);
                    console.log(`      É gravável: ${char.isWritableWithResponse || char.isWritableWithoutResponse}`);
                }
            }
            
            // NÃO desconecta - mantém a conexão para usar o dispositivo
            console.log(' Serviços descobertos e dispositivo permanece conectado');
            
        }
        catch(err: any){
            console.error(' Erro ao descobrir serviços:', err);
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
            await device.discoverAllServicesAndCharacteristics();

            // DESCOBRE SERViÇOS AUTOMATICAMENTE APÓS CONECTAR
            console.log(' Descobrindo serviços automaticamente...');
            console.log(`\n Conectado ao dispositivo: ${device.name}`);
            const services = await device.services();
            console.log('\n SERViÇOS DO DISPOSITIVO CONECTADO:');
            
            for (const service of services) {
                console.log(`\n Serviço UUID: ${service.uuid}`);
                const characteristics = await service.characteristics();
                console.log(`   Características (${characteristics.length}):`);
                
                for (const char of characteristics) {
                    console.log(`   └─ UUID: ${char.uuid}`);
                    
                    // Propriedades corretas
                    const properties = [
                        char.isReadable ? 'Leitura' : '',
                        char.isWritableWithResponse ? 'Escrita com resposta' : '',
                        char.isWritableWithoutResponse ? 'Escrita sem resposta' : '',
                        char.isNotifiable ? 'Notificável' : '',
                        char.isIndicatable ? 'Indicável' : '',
                    ].filter(Boolean).join(', ') || 'Nenhuma';
                    
                    console.log(`      Propriedades: ${properties}`);
                    console.log(`      Valor: ${char.value || 'N/A'}`);
                }
            }
            
            console.log(' Conexão e descoberta de serviços concluídas!');
            return device; 
        }
        catch(err: any){
            console.error('Falha ao conectar-se a um dispositivo! ', err);
            throw err;
        }
    }

    // Desconectar-se de um dispositivo
    async disconnectDevice(device: BluetoothDevice): Promise<void> {

        try{
            console.log(`\n Desconectando do dispositivo: ${device.name}...`);
            await this.manager.cancelDeviceConnection(device.id);
            console.log(`Desconectado de: ${device.name}`);
        }
        catch(err: any){
            console.error('Falha ao desconectar-se! ', err);
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
            console.error('Falha na leitura de caracteristicas! ', err);
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
            console.log(' Debug - Value recebido:', value);
            console.log(' Debug - Tipo:', typeof value);

            let valueToSend: string;

            // Se for string com \n, converter para base64
            if (typeof value === 'string' && value.includes('\n')) {
                valueToSend = btoa(unescape(encodeURIComponent(value)));
                console.log(' Convertido para base64:', valueToSend);
            } else {
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
            console.error(' Falha detalhada:', {
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

    // Limpar rescursos 
    destoy(): void {

        this.manager.destroy();
    }
}

export const bleService = new BleService();