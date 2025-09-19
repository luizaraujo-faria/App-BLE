export interface BluetoothDevice {
    id: string;
    name: string | null;
    localName?: string | null;
    manufactureData?: string | null;
    serviceUUIDs?: string[] | null;
    rssi?: number | null;
    mtu?: number | null;
};

export interface BluetoothService {
    uuid: string;
    characteristics: BluetoothCharacteristic[];
};

export interface BluetoothCharacteristic {
    uuid: string;
    properties: string[];
    value?: string | null;
};

export interface ScanOptions {
    allowDuplicates?: boolean;
    scanMode?: number;
};