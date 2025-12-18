import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import { SwitchItem } from '@/src/components/ui/Switch';
import { useDeviceToggles } from '@/src/hooks/useDeviceToogle';
import BLEIcon from '../../../assets/images/bluetooth.png';
import { useBleContext } from '@/src/contexts/BleContext';
import { usePopup } from '@/src/contexts/PopupContext';

type DeviceItem = {
    label: string;
    value: string;
}

const SettingsScreen = () => {

    const { showPopup } = usePopup();

    const {
        // uiBluetoothOn,
        // uiLocationOn,
        // toggleBluetooth,
        // toggleLocation,
        isBluetoothOn,
        isLocationOn,
    } = useDeviceToggles();

    const {
        devices,
        isScanning,
        isConnected,
        currentDevice,
        scanDevices,
        stopScan,
        connectToDevice,
        disconnectDevice,
        startReading,
    } = useBleContext();
        
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState<DeviceItem[]>([]);

    useEffect(() => {
        if(isConnected) {
            startReading(
                '12345678-1234-1234-1234-1234567890ab',
                'abcd1234-5678-1234-5678-1234567890ab',
            );
        }
    }, [isConnected, startReading]);
    
    // Atualiza a lista do Dropdown com os dispositivos escaneados
    useEffect(() => {
        const deviceItems: DeviceItem[] = devices.map(device => ({
            label: device.name || device.localName || 'Dispositivo desconhecido',
            value: device.id,
        }));
        setItems(deviceItems);
    }, [devices]);
    
    // Quando o usuário seleciona um dispositivo no dropdown
    useEffect(() => {

        if(value){

            const selectedDevice = devices.find(device => device.id === value);
            if (selectedDevice && !isConnected) {
                connectToDevice(value, selectedDevice)
                    .then(() => {
                        showPopup('Aviso', `Conectado a ${selectedDevice.name || 'dispositivo'}!`);
                    })
                    .catch((err) => {
                        console.error('\nFalha na conexão:', err.message);
                        showPopup('Erro', `Falha na conexão! Erro: ${err.message}.`);
                    });
            }
        }
    }, [value, devices, isConnected, connectToDevice, showPopup]);

    // Alternar Bluetooth
    const toggleBluetooth = async () => {

        if(isBluetoothOn){
            showPopup('Aviso!', 'Desative o serviço de bluetooth nas configurações!');
            return;
        } 
        else{
            showPopup('Aviso!', 'Ative o serviço de bluetooth nas configurações!');
            return;
        }
    };

    // Alternar Localização
    const toggleLocation = async () => {

        if(isLocationOn){
            showPopup('Aviso!', 'Desative o serviço de localização nas configurações!');
            return;
        }
        else{
            showPopup('Aviso!', 'Ative o serviço de localização nas configurações!');
            return;
        }
    };
    
    const handleDisconnect = async () => {
        if(currentDevice){
            try{
                await disconnectDevice(currentDevice);
                setValue(null);
            } 
            catch(err: any){
                console.error('\nErro ao desconectar:', err.message);
            }
        }
    };
    
    const _dropdownPlaceholder = isConnected 
        ? `Conectado: ${currentDevice?.name || currentDevice?.localName || 'Dispositivo'}`
        : 'Selecione um dispositivo';

    return (

        <View style={{ flex: 1 }}>
            
            <Header subtitle={'Configurações'}/>

            <View style={ styles.container }>

                <View style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-between' }}>
 
                    {/* Status Bluetooth */}
                    <View style={styles.statusPanel}>

                        <View style={{ width: '75%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={styles.title}>Controle Bluetooth</Text>
                            <Image source={BLEIcon} style={{ width: 30, height: 30 }} />
                        </View>

                        <Text style={{ fontSize: 20, marginBottom: 28 }}>Status: 
                            <Text style={styles.connectedText}>
                                {isConnected 
                                    ? ` Conectado a ${currentDevice?.name || currentDevice?.localName || 'dispositivo'}`
                                    : ' Desconectado'
                                }
                            </Text>
                        </Text>
                        {isScanning && <Text style={styles.scanningText}>Escaneando dispositivos...</Text>}

                    </View>

                    {/* Mensagem de aviso */}
                    <View style={styles.info}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name='warning' size={30} color={'#da0700ff'} />
                            <Text style={{ width: '88%', fontSize: 20, textAlign: 'justify', fontFamily: 'AfacadFlux' }}>Para o uso desta funcionalidade é necessário que o Bluetooth e Localização do dispositivo estejam ativados!</Text>
                        </View>
                    
                        <View style={{ width: '100%', gap: 0 }}>

                            <SwitchItem label='Status Bluetooth' value={isBluetoothOn} onToggle={toggleBluetooth}/>

                            <SwitchItem label='Status Localização' value={isLocationOn} onToggle={toggleLocation}/>

                        </View>
                    </View>

                    <View style={{ width: '100%' }}>
                        <Button 
                            textButton={isScanning ? 'Parar Busca' : 'Buscar Dispositivos'} 
                            onPress={isScanning ? stopScan : scanDevices}
                            style={null}
                            textStyle={null}
                            disabled={!isBluetoothOn || !isLocationOn}/>

                        <DropDownPicker
                            disabled={!isBluetoothOn || !isLocationOn}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder={'Dispositivos encontrados'}
                            style={(isBluetoothOn && isLocationOn) ? styles.dropdown : styles.dropdownDisabled}
                            dropDownContainerStyle={styles.dropdownContainer}
                            labelStyle={styles.dropdownLabel}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedItemContainerStyle={styles.selectedItemContainer}
                            selectedItemLabelStyle={styles.selectedItemLabel}
                        />

                        {isConnected && currentDevice && (
                            <View style={{ width: '100%', marginTop: 10 }}>

                                <Button 
                                    textButton={`Desconectar-se de: ${currentDevice.name?.split(' ').slice(0, 3).join(' ') || currentDevice.localName?.split(' ').slice(0, 3).join(' ')}`} 
                                    onPress={handleDisconnect}
                                    style={styles.disconnectButton}
                                    textStyle={null}
                                    disabled={false}/>
                            </View>
                        )}
                    </View>

                </View>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f4f4f4ff',
        padding: 24,
    },
    statusPanel: { 
        alignItems: 'flex-start', 
        justifyContent: 'flex-start', 
        height: '16%',
        marginTop: '5%',
    },
    info: {
        marginBottom: '40%',
        width: '100%',
        height: 100,
        alignItems: 'center',
        gap: 25,
    },
    title: {
        fontSize: 32,
        color: '#333',
        fontFamily: 'AfacadFlux',
    },
    connectedText: {
        fontSize: 20,
        color: '#ff9500ff',
        fontFamily: 'AfacadFlux',
    },
    scanningText: {
        fontSize: 20,
        color: '#ff9500ff',
        fontFamily: 'AfacadFlux',
    },
    disconnectButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#da0700ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#ffb54c',
        borderWidth: 0,
        borderRadius: 4,
        height: 50,
    },
    dropdownDisabled: {
        backgroundColor: '#cea163ff',
        borderWidth: 0,
        borderRadius: 4,
        height: 50,
    },
    dropdownContainer: {
        backgroundColor: '#ebebebea',
        borderWidth: 0,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        boxShadow: '0px -1px 3px #0000007e',
    },
    dropdownLabel: {
        fontSize: 22,
        color: '#ffffffff',
        fontFamily: 'AfacadFlux',
    },
    dropdownPlaceholder: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
        fontFamily: 'AfacadFlux',
    },
    selectedItemContainer: {
        backgroundColor: '#a7a7a7',
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default SettingsScreen;