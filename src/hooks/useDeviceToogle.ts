// src/hooks/useDeviceToggles.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { BleManager, State } from 'react-native-ble-plx';
import { usePopup } from '../contexts/PopupContext';
// import * as Linking from 'expo-linking';
// import { Alert } from 'react-native';
// import { Platform, PermissionsAndroid } from 'react-native';

export function useDeviceToggles() {

    const { showPopup } = usePopup();

    const [isBluetoothOn, setBluetoothOn] = useState(false);
    const [isLocationOn, setLocationOn] = useState(false);
    const [uiBluetoothOn, setUiBluetoothOn] = useState(false);
    const [uiLocationOn, setUiLocationOn] = useState(false);
    
    const bleManager = new BleManager();

    // Sincroniza estados reais com a UI - IMPLEMENTAÇÃO NOVA
    useEffect(() => {
        setUiBluetoothOn(isBluetoothOn);
    }, [isBluetoothOn]);

    useEffect(() => {
        setUiLocationOn(isLocationOn);
    }, [isLocationOn]);


    // Checa o estado atual do Bluetooth
    useEffect(() => {
        const subscription = bleManager.onStateChange((state) => {
            setBluetoothOn(state === State.PoweredOn);
            setUiBluetoothOn(state === State.PoweredOn);
        }, true);
        return () => subscription.remove();
    }, [bleManager]);

    useEffect(() => {

        let intervalId: number;

        const checkLocationStatus = async () => {

            const enabled = await Location.hasServicesEnabledAsync();
            setLocationOn(enabled);
            setUiLocationOn(enabled);
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
            showPopup('Aviso!', 'Desative o serviço de bluetooth nas configurações!');
            setUiBluetoothOn(true);
            return;
            // Alert.alert('Aviso de sistemas!', 'Desative o serviço de bluetooth nas configurações!');
        } 
        else{
            showPopup('Aviso!', 'Ative o serviço de bluetooth nas configurações!');
            setUiBluetoothOn(false);
            return;
        }
    }

    // Alternar Localização
    async function toggleLocation() {

        if(isLocationOn){
            console.log('Desative o serviço de localização nas configurações!');
            showPopup('Aviso!', 'Desative o serviço de localização nas configurações!');
            setUiLocationOn(true);
            return;
        }

        // Solicita permissão
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            showPopup('Aviso!', 'Permissão de localização não fornecida.');
            setUiLocationOn(false);
            return;
        } 

        const enabled = await Location.hasServicesEnabledAsync();
        if(enabled){
            setLocationOn(enabled);
        } 
        else{
            showPopup('Aviso!', 'Ative o serviço de localização nas configurações!');
            setUiLocationOn(false);
            return;
        }
    }

    return {
        isBluetoothOn,
        isLocationOn,
        uiBluetoothOn,
        uiLocationOn,
        toggleBluetooth,
        toggleLocation,
    };
}