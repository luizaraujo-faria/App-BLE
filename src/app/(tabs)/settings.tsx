import Button from '@/src/components/Button';
import { SwitchItem } from '@/src/components/Switch';
import { useBleContext } from '@/src/contexts/BleContext';
import { usePopup } from '@/src/contexts/PopupContext';
import { useDeviceToggles } from '@/src/hooks/useDeviceToogle';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Linking, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { appColors } from '@/src/styles/styles';
import { MaterialCommunityIcon } from '@/src/components/Icons';

type DeviceItem = {
    label: string;
    value: string;
}

const SettingsScreen = () => {

    const { showPopup } = usePopup();

    const {
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
        
    const [isLoading, setLoading] = useState(false);
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
                setLoading(true);
                await disconnectDevice(currentDevice);
                setValue(null);
            } 
            catch(err: any){
                console.error('\nErro ao desconectar:', err.message);
            }
            finally{
                setLoading(false);
            }
        }
    };

    const handleScan = async () => {

        if(isScanning){
            stopScan();
            setLoading(false);
            return;
        }

        scanDevices();
        setLoading(true);
        return;
    };

    const openAppSettings = async () => {
        try {
            if (Platform.OS === 'ios') {
                await Linking.openURL('app-settings:');
            } else {
                await Linking.openSettings();
            }
        } catch (error) {
            console.log('Erro ao abrir configurações:', error);
        }
    };

    // useEffect(() => {

    //     if(isConnected && currentDevice){
    //         setLoading(false);
    //     }

    // }, [currentDevice, isConnected]);
    
    const _dropdownPlaceholder = isConnected 
        ? `Conectado: ${currentDevice?.name || currentDevice?.localName || 'Dispositivo'}`
        : 'Selecione um dispositivo';

    return (

        <View style={ styles.container }>
            <View style={styles.inner}>

                <View style={styles.groupPanels}>
                    {/* Status Bluetooth */}
                    <View style={styles.statusPanel}>

                        <View style={{ width: 'auto', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.title}>Controle Bluetooth</Text>
                            <MaterialCommunityIcon iconName='bluetooth-settings' iconSize={28} iconColor={appColors.primary} />
                        </View>

                        <Text style={{ fontSize: 20 }}>Status: 
                            <Text style={styles.connectedText}>
                                {isConnected 
                                    ? ` Conectado a ${currentDevice?.name || currentDevice?.localName || 'dispositivo'}`
                                    : ' Desconectado'
                                }
                            </Text>
                        </Text>
                    </View>

                    {/* Mensagem de aviso */}
                    <View style={styles.info}>

                        <View style={{ width: '100%', alignItems: 'center', gap: 5 }}>
                            <Ionicons name='warning' size={30} color={'#da0700ff'} />
                            <Text style={styles.infoText}>
                                Para o uso desta funcionalidade é necessário que o Bluetooth 
                                e Localização do dispositivo estejam permitidos e ativados!
                            </Text>
                        </View>
                    
                        <View
                            style={{
                                width: '100%',
                                gap: 10,
                            }}
                        >
                            <View style={styles.infoStatus}>

                                <SwitchItem label='Bluetooth' value={isBluetoothOn} onToggle={toggleBluetooth}/>

                                <SwitchItem label='Localização' value={isLocationOn} onToggle={toggleLocation}/>

                            </View>

                            <Button 
                                textButton={'Verificar Permissões'} 
                                onPress={openAppSettings}
                                style={null}
                                textStyle={{ color: '#000' }}
                                disabled={false}
                                loading={false}
                                icon={<MaterialCommunityIcon 
                                    iconName='security' 
                                    iconColor='#000' 
                                    iconSize={24} 
                                />}
                            />
                        </View>
                    </View>
                </View>

                {isScanning && isLoading && (
                    <View style={{
                        width: '80%',
                        height: '5%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#83838317',
                        borderRadius: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                    }}>
                        <ActivityIndicator size='small' color='#ffb54cff' />
                        <Text style={styles.scanningText}>Buscando Dispositivos próximos...</Text>
                    </View>)}

                <View style={styles.actionContainer}>

                    {isConnected && currentDevice && (

                        <Button 
                            textButton={`Desconectar-se de: ${currentDevice.name?.split(' ').slice(0, 3).join(' ') || currentDevice.localName?.split(' ').slice(0, 3).join(' ')}`} 
                            onPress={handleDisconnect}
                            style={styles.disconnectButton}
                            textStyle={null}
                            disabled={false}
                            loading={false}
                            icon={null}
                        />
                    )}
                    <Button 
                        textButton={isScanning ? 'Parar Busca' : 'Buscar Dispositivos'} 
                        onPress={handleScan}
                        style={null}
                        textStyle={{ color: '#000' }}
                        disabled={!isBluetoothOn || !isLocationOn}
                        loading={false}
                        icon={<MaterialCommunityIcon 
                            iconName='devices' 
                            iconColor='#000' 
                            iconSize={24} 
                        />}
                    />

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
                </View>

            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appColors.tertiary,
        paddingHorizontal: 10,
        paddingVertical: 24,
    },
    inner: {
        width: '100%', 
        height: '100%', 
        alignItems: 'center', 
        justifyContent: 'space-between',
    },
    groupPanels: {
        width: '100%', 
        height: '65%', 
        gap: '5%', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusPanel: { 
        width: '100%',
        height: '25%',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
    },
    info: {
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 25,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
    },
    infoText: {
        fontSize: 20, 
        textAlign: 'center', 
        fontFamily: 'AfacadFlux',
    },
    infoStatus: {
        width: '100%', 
        gap: 0, 
        backgroundColor: appColors.tertiary,
        borderRadius: 10,
    },
    actionContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        gap: 0,
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
        color: '#000',
        fontFamily: 'AfacadFlux',
    },
    dropdownPlaceholder: {
        textAlign: 'center',
        fontSize: 20,
        color: '#000',
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