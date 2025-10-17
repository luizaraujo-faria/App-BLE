// src/hooks/useDeviceToggles.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { BleManager, State } from 'react-native-ble-plx';
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

    // Alternar Bluetooth
    async function toggleBluetooth() {
        if (isBluetoothOn) {
            alert('O Bluetooth só pode ser desativado manualmente nas configurações do sistema.');
            await Linking.openSettings();
        } else {
            // No Expo não dá pra ativar o Bluetooth via código.
            // Então avisamos o usuário e pedimos pra ativar.
            alert('Ative o Bluetooth nas configurações do sistema.');
            await Linking.openSettings();
        }
    }

    // Alternar Localização
    async function toggleLocation() {
        if (isLocationOn) {
            alert('Para desativar, vá até as configurações do sistema.');
            await Linking.openSettings();
            return;
        }

        // Solicita permissão
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            const enabled = await Location.hasServicesEnabledAsync();
            if (enabled) {
                setLocationOn(true);
            } else {
                alert('Ative a localização manualmente nas configurações.');
                await Linking.openSettings();
            }
        } else {
            alert('Permissão de localização negada.');
        }
    }

    return {
        isBluetoothOn,
        isLocationOn,
        toggleBluetooth,
        toggleLocation,
    };
}