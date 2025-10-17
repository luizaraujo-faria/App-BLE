import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useBle } from '../../hooks/useBle';
import { bleService } from '../../ble/BleService';
import DropDownPicker from 'react-native-dropdown-picker';
import { deviceConfig } from '../../ble/deviceConfig';
import Button from '@/src/components/ui/Button';
import { sheetsAPI } from '@/src/services/api.js';

interface DeviceItem {
  label: string;
  value: string;
};

const HomeScreen = () => {

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
    } = useBle();
    
    const [message, setMessage] = useState<string>('');
    const [ledState, setLedState] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState<DeviceItem[]>([]);

    // Atualiza a lista do Dropdown com os dispositivos escaneados
    useEffect(() => {
        const deviceItems: DeviceItem[] = devices.map(device => ({
            label: device.name || device.localName || 'Dispositivo Desconhecido',
            value: device.id,
        }));
        setItems(deviceItems);
    }, [devices]);

    // Mostra erros do BLE
    useEffect(() => {
        if(error){
            Alert.alert('Erro BLE', error);
        }
    }, [error]);

    // Quando o usuário seleciona um dispositivo no dropdown
    useEffect(() => {
        if (value) {
            const selectedDevice = devices.find(device => device.id === value);
            if (selectedDevice && !isConnected) {
                connectToDevice(value)
                    .then(() => {
                        Alert.alert('Sucesso', `Conectado a ${selectedDevice.name || 'dispositivo'}`);
                    })
                    .catch((err: any) => {
                        console.error('Falha na conexão:', `Erro: ${error}`, err.message);
                        Alert.alert('Falha na conexão: ', `Erro: ${error}`);
                    });
            }
        }
    }, [value, devices, isConnected]);

    const handleSubmit = async (text: string) => {
    
        try{

            const values = [
                null,
                text,
                null,
            ];

            const result = await sheetsAPI.writeData({
                values: values,
                sheetName: 'Sheet1',
            });

            if(result){
                console.log('Mensagem enviada para google sheets com sucesso!');
            }

        }
        catch(err: any){
            console.error('Erro:', err);
            Alert.alert('Erro', 'Não foi possível conectar com o servidor');
        }
    };

    // ⚡ FUNÇÃO PARA LIGAR/DESLIGAR LED (específica deste dispositivo)
    const toggleLED = async (state: boolean) => {
        if (!currentDevice) return;

        try {
            const command = state ? deviceConfig.COMMANDS.LED_ON : deviceConfig.COMMANDS.LED_OFF;
      
            console.log('🔍 Command original:', JSON.stringify(command)); // Mostra caracteres especiais
      
            // Converter para base64 para preservar o \n
            const base64Value = btoa(unescape(encodeURIComponent(command)));
            console.log('🔍 Command base64:', base64Value);

            await bleService.writeCharacteristic(
                currentDevice.id,
                deviceConfig.SERVICE_UUID,
                deviceConfig.CHARACTERISTIC_UUID,
                base64Value,
            );
      
            setLedState(state);
            Alert.alert('Sucesso', `LED ${state ? 'ligado' : 'desligado'}`);
        } 
        catch(err: any){
            console.error('❌ Erro:', err);
            Alert.alert('Erro', err.message);
        }
    };

    // ⚡ FUNÇÃO PARA ENVIAR MENSAGEM (específica deste dispositivo)
    const sendDisplayMessage = async (text: string) => {
        if (!currentDevice) {
            Alert.alert('Erro', 'Nenhum dispositivo conectado');
            return;
        }

        if (!text.trim()) {
            Alert.alert('Erro', 'Digite uma mensagem');
            return;
        }

        try {
            const value = `display:${message}`;
      
            console.log('🔍 Command original:', JSON.stringify(value)); // Mostra caracteres especiais
      
            // Converter para base64 para preservar o \n
            const base64Value = btoa(unescape(encodeURIComponent(value)));
            console.log('🔍 Command base64:', base64Value);
      
            await bleService.writeCharacteristic(
                currentDevice.id,
                deviceConfig.SERVICE_UUID,
                deviceConfig.CHARACTERISTIC_UUID,
                base64Value,
            );
      
            Alert.alert('Sucesso', 'Mensagem enviada!');
            setMessage(''); // Limpa o campo após envio
        } 
        catch(err: any){
            console.error('Erro ao enviar mensagem:', err);
            Alert.alert('Erro', 'Falha ao enviar mensagem');
        }
    };

    // ⚡ FUNÇÃO PARA LIMPAR DISPLAY (específica deste dispositivo)
    const clearDisplayMessage = async () => {
        if (!currentDevice) {
            Alert.alert('Erro', 'Nenhum dispositivo conectado');
            return;
        }

        try {
            await bleService.writeCharacteristic(
                currentDevice.id,
                deviceConfig.SERVICE_UUID,
                deviceConfig.CHARACTERISTIC_UUID,
                deviceConfig.COMMANDS.CLEAR_DISPLAY,
            );
      
            Alert.alert('Sucesso', 'Display limpo!');
            setMessage(''); // Limpa o campo também
        } 
        catch(err: any){
            console.error('Erro ao limpar display:', err);
            Alert.alert('Erro', 'Falha ao limpar display');
        }
    };

    const handleDisconnect = async () => {
        if (currentDevice) {
            try {
                await disconnectDevice(currentDevice);
                setValue(null);
                Alert.alert('Desconectado', 'Dispositivo desconectado com sucesso');
            } 
            catch (err: any){
                console.error('Erro ao desconectar:', err);
                Alert.alert('Erro ao desconectar:', err.message);
            }
        }
    };

    const _dropdownPlaceholder = isConnected 
        ? `Conectado: ${currentDevice?.name || currentDevice?.localName || 'Dispositivo'}`
        : 'Selecione um dispositivo';

    return (

        <View style={styles.container}>

            <View style={{ width: '100%' }}>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                    <Text style={styles.title}>Controle Bluetooth</Text>

                    <Text style={styles.connectedText}>
                        {isConnected 
                            ? `Conectado a ${currentDevice?.name || currentDevice?.localName || 'dispositivo'}`
                            : 'Desconectado'
                        }
                    </Text>
                    {isScanning && <Text style={styles.scanningText}>Escaneando...</Text>}

                </View>

                <Button 
                    textButton={isScanning ? 'Parar Busca' : 'Buscar Dispositivos'} 
                    onPress={isScanning ? stopScan : scanDevices}
                    style={null}
                    disabled={undefined}/>

                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder={'Teste'}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    labelStyle={styles.dropdownLabel}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedItemContainerStyle={styles.selectedItemContainer}
                    selectedItemLabelStyle={styles.selectedItemLabel}
                />

                {isConnected && currentDevice && (
                    <View style={{ width: '100%', marginTop: 10 }}>

                        <Button 
                            textButton={`Desconectar-se de: ${currentDevice.name || currentDevice.localName}`} 
                            onPress={handleDisconnect}
                            style={styles.disconnectButton}
                            disabled={undefined}/>
                    </View>
                )}

            </View>

            <View style={{ width: '100%' }}>

                <View style={styles.messageContainer}>
                    <Button 
                        textButton={isConnected && ledState ? 'Desligar LED' : 'Acionar LED'}
                        onPress={ledState ? () => toggleLED(false) : () => toggleLED(true)}
                        style={!isConnected && styles.buttonDisabled}
                        disabled={!isConnected}/>
                </View>

                <View style={styles.messageContainer}>

                    <TextInput
                        style={styles.input}
                        placeholder='Digite sua mensagem'
                        placeholderTextColor='#666'
                        value={message}
                        onChangeText={setMessage}
                        maxLength={80}
                        editable={isConnected}
                    />

                    <Button 
                        textButton='Enviar Mensagem'
                        onPress={() => { sendDisplayMessage(message); handleSubmit(message); }}
                        style={!isConnected && styles.buttonDisabled}
                        disabled={!isConnected}/>

                    <Button 
                        textButton='Limpar Display'
                        onPress={clearDisplayMessage}
                        style={!isConnected && styles.buttonDisabled}
                        disabled={!isConnected}/>

                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    connectedText: {
        fontSize: 18,
        color: '#008cffff',
        fontWeight: 'normal',
        marginBottom: 20,
    },
    messageContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        padding: 8,
        fontSize: 20,
        color: '#000',
    },
    scanningText: {
        lineHeight: 45,
        fontSize: 16,
        color: '#007AFF',
        fontStyle: 'italic',
    },
    disconnectButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FF3B30',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 10,
    },
    buttonDisabled: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 10,
        backgroundColor: '#CCCCCC',
    },
    dropdown: {
        backgroundColor: '#ffb54c',
        borderWidth: 0,
        borderRadius: 4,
        height: 50,
    },
    dropdownContainer: {
        backgroundColor: '#f5f5f5',
        borderWidth: 0,
        borderRadius: 4,
    },
    dropdownLabel: {
        fontSize: 18,
        color: '#ffffff',
    },
    dropdownPlaceholder: {
        fontSize: 18,
        color: '#ffffff',
    },
    selectedItemContainer: {
        backgroundColor: '#a7a7a7',
    },
    selectedItemLabel: {
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default HomeScreen;