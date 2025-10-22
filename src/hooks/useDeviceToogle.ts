// src/hooks/useDeviceToggles.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
// import * as Linking from 'expo-linking';
import { BleManager, State } from 'react-native-ble-plx';
import { Alert } from 'react-native';
// import { Platform, PermissionsAndroid } from 'react-native';

export function useDeviceToggles() {
    const [isBluetoothOn, setBluetoothOn] = useState(false);
    const [isLocationOn, setLocationOn] = useState(false);
    const bleManager = new BleManager();

    // Checa o estado atual do Bluetooth
    useEffect(() => {
        const subscription = bleManager.onStateChange((state) => {
            setBluetoothOn(state === State.PoweredOn);
        }, true);
        return () => subscription.remove();
    }, [bleManager]);

    useEffect(() => {

        let intervalId: number;

        const checkLocationStatus = async () => {

            const enabled = await Location.hasServicesEnabledAsync();
            setLocationOn(enabled);
        };

        checkLocationStatus();

        intervalId = setInterval(checkLocationStatus, 100);

        return () => {
            if(intervalId){
                clearInterval(intervalId);
            }
        };

    }, []);

    // Alternar Bluetooth
    async function toggleBluetooth() {

        if(isBluetoothOn){
            Alert.alert('Aviso!', 'Desative o serviço de bluetooth nas configurações!');
        } 
        else{
            Alert.alert('Aviso!', 'Ative o serviço de bluetooth nas configurações!');
        }
    }

    // Alternar Localização
    async function toggleLocation() {

        if(isLocationOn){
            Alert.alert('Aviso!', 'Desative o serviço de localização nas configurações!');
            return;
        }

        // Solicita permissão
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            Alert.alert('Aviso!', 'Permissão de localização não fornecida.');
        } 

        const enabled = await Location.hasServicesEnabledAsync();
        if(enabled){
            setLocationOn(enabled);
        } 
        else{
            Alert.alert('Aviso!', 'Ative o serviço de localização nas configurações!');
        }
    }

    return {
        isBluetoothOn,
        isLocationOn,
        toggleBluetooth,
        toggleLocation,
    };
}