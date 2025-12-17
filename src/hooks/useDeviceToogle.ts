// src/hooks/useDeviceToggles.ts
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { State } from 'react-native-ble-plx';
import { bleService } from '../ble/BleService';

export function useDeviceToggles() {
    
    const [isBluetoothOn, setBluetoothOn] = useState<boolean | null>(null);
    const [isLocationOn, setLocationOn] = useState<boolean | null>(null);
    const [ready, setReady] = useState(false);

    const initialized = useRef(false);

    // Bluetooth
    useEffect(() => {
        const sub = bleService.manager.onStateChange((state) => {
            setBluetoothOn(state === State.PoweredOn);
        }, true);

        return () => sub.remove();
    }, []);

    // Localização
    useEffect(() => {

        let interval: ReturnType<typeof setInterval>;

        const checkLocation = async () => {
            const enabled = await Location.hasServicesEnabledAsync();
            setLocationOn(enabled);
        };

        checkLocation();

        interval = setInterval(checkLocation, 3000);

        return () => clearInterval(interval);
    }, []);

    // Marca como pronto quando ambos forem conhecidos
    useEffect(() => {
        if (
            !initialized.current &&
            isBluetoothOn !== null &&
            isLocationOn !== null
        ) {
            setReady(true);
            initialized.current = true;
        }
    }, [isBluetoothOn, isLocationOn]);

    return {
        isBluetoothOn: !!isBluetoothOn,
        isLocationOn: !!isLocationOn,
        ready,
    };
}