import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '@/src/components/ui/Button';
import Header from '@/src/components/layout/Header';
import { SwitchItem } from '@/src/components/ui/Switch';
import { useDeviceToggles } from '@/src/hooks/useDeviceToogle';
import Popup from '@/src/components/ui/Popup';
import BLEIcon from '../../../assets/images/bluetooth.png';
import { useBleContext } from '@/src/contexts/BleContext';
// import { deviceConfig } from '../../ble/deviceConfig';
// import { bleService } from '../../ble/BleService';

type DeviceItem = {
    label: string;
    value: string;
}

const SettingsScreen = () => {

    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const {
        uiBluetoothOn,
        uiLocationOn,
        toggleBluetooth,
        toggleLocation,
        popupProps,
    } = useDeviceToggles();

    const {
        devices,
        isScanning,
        isConnected,
        currentDevice,
        error,
        scanDevices,
        stopScan,
        connectToDevice,
        disconnectDevice,
        receivedData,
        startReading,
    } = useBleContext();
        
    // const [message, setMessage] = useState<string>('');
    // const [ledState, setLedState] = useState<boolean>(false);
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
    }, [isConnected]);

    useEffect(() => {
        console.log('\n🟧 [SETTINGS] isConnected mudou:', isConnected);
    }, [isConnected]);

    useEffect(() => {
        console.log('🟥 [SETTINGS] startReading é função?', typeof startReading);
    }, [startReading]);

    useEffect(() => {
        console.log('🟦 [SETTINGS] receivedData mudou:', receivedData);
    }, [receivedData]);
    
    // Atualiza a lista do Dropdown com os dispositivos escaneados
    useEffect(() => {
        const deviceItems: DeviceItem[] = devices.map(device => ({
            label: device.name || device.localName || 'Dispositivo desconhecido',
            value: device.id,
        }));
        setItems(deviceItems);
    }, [devices]);
    
    // Mostra erros do BLE
    useEffect(() => {
        if(error){
            setPopupVisible(true);
            setPopupMessage(`Falha do Bluetooth! Erro: ${error}`);
        }
    }, [error]);
    
    // Quando o usuário seleciona um dispositivo no dropdown
    useEffect(() => {

        if(value){

            const selectedDevice = devices.find(device => device.id === value);
            if (selectedDevice && !isConnected) {
                connectToDevice(value, selectedDevice)
                    .then(() => {
                        setPopupVisible(true);
                        setPopupMessage(`Conectado a ${selectedDevice.name || 'dispositivo'}!`);
                        // Alert.alert('\nSucesso', `Conectado a ${selectedDevice.name || 'dispositivo'}`);
                    })
                    .catch((err) => {
                        console.error('\nFalha na conexão:', `Erro: ${error}`, err.message);
                        setPopupVisible(true);
                        setPopupMessage(`Falha na conexão! Erro: ${err.message}.`);
                    });
            }
        }
    }, [value, devices, isConnected, connectToDevice, error]);
    
    const handleDisconnect = async () => {
        if (currentDevice) {
            try {
                await disconnectDevice(currentDevice);
                setValue(null);
                setPopupVisible(true);
                setPopupMessage(`Desconectado do dispositivo: ${currentDevice.name} com sucesso!`);
            } 
            catch (err: any){
                console.error('\nErro ao desconectar:', err);
                setPopupVisible(true);
                setPopupMessage(`Erro ao desconectar-se de: ${currentDevice.name}!`);
            }
        }
    };
    
    const _dropdownPlaceholder = isConnected 
        ? `Conectado: ${currentDevice?.name || currentDevice?.localName || 'Dispositivo'}`
        : 'Selecione um dispositivo';

    return (

        <View style={{ flex: 1 }}>

            <Popup title='Aviso' message={popupProps.popupMessage} visible={popupProps.popupVisible} onClose={() => popupProps.setPopupVisible(false)}/>
            <Popup title='Aviso' message={popupMessage} visible={popupVisible} onClose={() => setPopupVisible(false)}/>
            
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
                            <Text style={{ width: '88%', fontSize: 16, textAlign: 'justify' }}>Para o uso desta funcionalidade é necessário que o Bluetooth e Localização do dispositivo estejam ativados!</Text>
                        </View>
                    
                        <View style={{ width: '100%', gap: 0 }}>

                            <SwitchItem label='Status Bluetooth' value={uiBluetoothOn} onToggle={toggleBluetooth}/>

                            <SwitchItem label='Status Localização' value={uiLocationOn} onToggle={toggleLocation}/>

                        </View>
                    </View>

                    <View style={{ width: '100%' }}>
                        <Button 
                            textButton={isScanning ? 'Parar Busca' : 'Buscar Dispositivos'} 
                            onPress={isScanning ? stopScan : scanDevices}
                            style={null}
                            disabled={!uiBluetoothOn || !uiLocationOn}/>

                        <DropDownPicker
                            disabled={!uiBluetoothOn || !uiLocationOn}
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder={'Dispositivos encontrados'}
                            style={(uiBluetoothOn && uiLocationOn) ? styles.dropdown : styles.dropdownDisabled}
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
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    connectedText: {
        fontSize: 18,
        color: '#ff9500ff',
        fontWeight: 'normal',
    },
    scanningText: {
        fontSize: 16,
        color: '#ff9500ff',
        fontStyle: 'italic',
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
        fontSize: 18,
        color: '#ffffffff',
    },
    dropdownPlaceholder: {
        fontSize: 18,
        color: '#ffffffff',
    },
    selectedItemContainer: {
        backgroundColor: '#a7a7a7',
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
    // messageContainer: {
    //     width: '100%',
    //     alignItems: 'center',
    //     gap: 16,
    //     marginBottom: 20,
    // },
    // input: {
    //     width: '100%',
    //     height: 56,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#000',
    //     padding: 8,
    //     fontSize: 20,
    //     color: '#000',
    // },
    // buttonDisabled: {
    //     width: '100%',
    //     height: 50,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     borderRadius: 4,
    //     marginBottom: 10,
    //     backgroundColor: '#CCCCCC',
    // },
});

export default SettingsScreen;