import { Platform, Linking } from 'react-native';
import * as Location from 'expo-location';

export type PermissionResult = {
  granted: boolean;
  message?: string;
};

export async function checkPermissions(): Promise<PermissionResult> {
    if (Platform.OS !== 'android') {
        return { granted: true };
    }

    const location = await Location.getForegroundPermissionsAsync();

    if (location.status !== 'granted') {
        return {
            granted: false,
            message: 'Permissão de localização não concedida',
        };
    }

    return { granted: true };
}

export async function requestPermissions(): Promise<PermissionResult> {
    if (Platform.OS !== 'android') {
        return { granted: true };
    }

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
        return {
            granted: false,
            message: 'Permissão de localização negada pelo usuário',
        };
    }

    return { granted: true };
}

export function openAppSettings() {
    Linking.openSettings();
}