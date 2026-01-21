import AppText from '@/src/components/AppText';
import Button from '@/src/components/Button';
import { AntDesignIcon, MaterialCommunityIcon, MaterialIcon } from '@/src/components/Icons';
import { SwitchItem } from '@/src/components/Switch';
import { useBleContext } from '@/src/contexts/BleContext';
import { usePopup } from '@/src/contexts/PopupContext';
import { useDeviceToggles } from '@/src/hooks/useDeviceToogle';
import { appColors } from '@/src/themes/colors';
import { appFonts } from '@/src/themes/fonts';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { LinearGradient } from 'expo-linear-gradient';

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
    const [userSelectedDevice, setUserSelectedDevice] = useState<string | null>(null);

    const servicesOn: boolean = isBluetoothOn && isLocationOn;

    useEffect(() => {
        if(!isConnected){
            setValue(null);
            setUserSelectedDevice(null);
            return;
        }
    }, [isConnected]);

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

        if(!servicesOn) return;
        if(!userSelectedDevice) return;
        if(!value) return;
        if(isConnected) return;

        const selectedDevice = devices.find(device => device.id === value);
        if (!selectedDevice) return;

        connectToDevice(value, selectedDevice)
            .then(() => {
                showPopup('Aviso', `Conectado a ${selectedDevice.name || 'dispositivo'}!`);
                setValue(null);
            })
            .catch((err) => {
                console.error('Falha na conexão:', err.message);
                showPopup('Erro', `Falha na conexão! Erro: ${err.message}.`);
                setValue(null);
            });
    }, [value, devices, isConnected, connectToDevice, showPopup, userSelectedDevice, servicesOn]);

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

            setLoading(true);

            try{
                console.log('   CAIU NO DISCONNECT');
                setValue(null);
                await disconnectDevice(currentDevice);
                return;
            } 
            catch(err: any){
                setLoading(false);
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
            return;
        }

        scanDevices();
        return;
    };

    const openAppSettings = async () => {
        try{
            if(Platform.OS === 'ios') {
                await Linking.openURL('app-settings:');
            } 
            else {
                await Linking.openSettings();
            }
        } 
        catch(err: any) {
            console.log('Erro ao abrir configurações:', err.message);
        }
    };
    
    const dropdownPlaceholder = isConnected 
        ? `Conectado: ${currentDevice?.name || currentDevice?.localName || 'Dispositivo'}`
        : 'Dispositivos encontrados';

    const connectedText = isConnected 
        ? ` Conectado a ${currentDevice?.name || currentDevice?.localName || 'dispositivo'}`
        : ' Desconectado';

    return (

        <LinearGradient 
            colors={[appColors.secondary, appColors.primary, appColors.primary]}
            style={ styles.container }>
            <View style={styles.inner}>

                <View style={styles.groupPanels}>
                    {/* Status Bluetooth */}
                    <View style={styles.statusPanel}>

                        <View style={{ alignItems: 'center' }}>
                            <View style={{ width: 'auto', flexDirection: 'row', alignItems: 'center' }}>
                                <AppText text='Controle de Bluetooth' textStyle={styles.title} />
                                <MaterialCommunityIcon iconName='bluetooth-settings' iconSize={28} iconColor={appColors.quintenary} />
                            </View>

                            <Text>
                                <AppText text='Status:' textStyle={{ fontSize: 20 }} />
                                <AppText text={connectedText} textStyle={styles.connectedText} />
                            </Text>
                        </View>

                        {isScanning && (
                            <View style={styles.scanningBar}>
                                <MaterialIcon 
                                    iconName='bluetooth-searching' 
                                    iconSize={20}
                                    iconColor={appColors.quintenary}
                                />
                                <AppText text='Buscando Dispositivos próximos...' textStyle={styles.scanningText} />
                            </View>
                        )}
                    </View>

                    <View style={styles.panelLine}></View>

                    {/* Mensagem de aviso */}
                    <View style={styles.info}>

                        <View style={{ width: '100%', alignItems: 'center', gap: 5 }}>
                            <Ionicons name='warning' size={30} color={'#da0700ff'} />
                            <AppText 
                                text='Para o uso desta funcionalidade é necessário que o Bluetooth e Localização do dispositivo estejam permitidos e ativados!'
                                textStyle={styles.infoText} 
                            />
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
                                style={{ backgroundColor: appColors.quintenary }}
                                textStyle={{ fontSize: 18, color: '#fff' }}
                                disabled={false}
                                loading={false}
                                icon={<MaterialCommunityIcon 
                                    iconName='security' 
                                    iconColor='#fff' 
                                    iconSize={24} 
                                />}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.actionContainer}>

                    {isConnected && currentDevice && (

                        <Button 
                            textButton={`Desconectar-se de: ${currentDevice.name?.split(' ').slice(0, 3).join(' ') || currentDevice.localName?.split(' ').slice(0, 3).join(' ')}`} 
                            onPress={handleDisconnect}
                            style={styles.disconnectButton}
                            textStyle={{ color: '#fff' }}
                            disabled={false}
                            loading={isLoading}
                            icon={null}
                        />
                    )}
                    <Button 
                        textButton={isScanning ? 'Parar Busca' : 'Buscar Dispositivos'} 
                        onPress={handleScan}
                        style={{ backgroundColor: appColors.quintenary }}
                        textStyle={{ fontSize: 18, color: '#fff' }}
                        disabled={!servicesOn}
                        loading={false}
                        icon={<MaterialCommunityIcon 
                            iconName='devices' 
                            iconColor='#fff' 
                            iconSize={24} 
                        />}
                    />

                    <DropDownPicker
                        key={servicesOn ? 'ble-on' : 'ble-off'}
                        disabled={!servicesOn}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={(callback) => {
                            setValue((prev) => {
                                const nextValue = typeof callback === 'function'
                                    ? callback(prev)
                                    : callback;

                                setUserSelectedDevice(nextValue);
                                return nextValue;
                            });
                        }}
                        setItems={setItems}
                        placeholder={dropdownPlaceholder}
                        style={(isBluetoothOn && isLocationOn) ? styles.dropdown : styles.dropdownDisabled}
                        dropDownContainerStyle={styles.dropdownContainer}
                        labelStyle={styles.dropdownLabel}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedItemContainerStyle={styles.selectedItemContainer}
                        selectedItemLabelStyle={styles.selectedItemLabel}
                        ArrowDownIconComponent={() => (
                            <AntDesignIcon iconName='caret-down' iconColor='#fff' iconSize={22} />
                        )}
                        ArrowUpIconComponent={() => (
                            <AntDesignIcon iconName='caret-up' iconColor='#fff' iconSize={22} />
                        )}
                        language='PT'
                        
                    />
                </View>

            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appColors.tertiary,
        paddingHorizontal: 10,
        paddingVertical: 16,
    },
    inner: {
        width: '100%', 
        height: '100%', 
        alignItems: 'center', 
        justifyContent: 'space-between',
    },
    groupPanels: {
        width: '100%', 
        height: '70%', 
        gap: '0%', 
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    statusPanel: { 
        width: '100%',
        height: '30%',
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        paddingTop: '8%',
        gap: '5%',
        // backgroundColor: appColors.primary,
    },
    title: {
        fontSize: 32,
    },
    connectedText: {
        fontSize: 20,
        color: appColors.quintenary,
        fontFamily: appFonts.afacadReg,
    },
    scanningText: {
        fontSize: 16,
        color: appColors.quintenary,
        fontFamily: appFonts.afacadReg,
    },
    scanningBar: {
        width: '70%',
        height: '25%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    panelLine: {
        width: '40%',
        height: 1.15,
        backgroundColor: appColors.quintenary,
    },
    info: {
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 25,
        padding: 10,
        // backgroundColor: appColors.quaternary
    },
    infoText: {
        fontSize: 18, 
        textAlign: 'center', 
        fontFamily: appFonts.afacadReg,
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
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disconnectButton: {
        width: '100%',
        height: 50,
        backgroundColor: appColors.quaternary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    dropdown: {
        backgroundColor: appColors.quintenary,
        borderWidth: 0,
        borderRadius: 10,
        height: 50,
    },
    dropdownDisabled: {
        backgroundColor: appColors.primaryDisabled,
        borderWidth: 0,
        borderRadius: 10,
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
        color: '#fff',
        fontFamily: appFonts.afacadReg,
    },
    dropdownPlaceholder: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        fontFamily: appFonts.afacadReg,
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