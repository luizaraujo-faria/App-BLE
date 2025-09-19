import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useBle } from "../hooks/useBle";
import DropDownPicker from 'react-native-dropdown-picker';

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
    
  // const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [message, setMessage] = useState<string>("");
  const [ledState, setLedState] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<DeviceItem[]>([]);

  // Listar dispositivos emparelhados
  const listDevices = async () => {
    Alert.alert("Funcionalidade não implementada", "A funcionalidade de Bluetooth foi removida deste exemplo");
  };

  // Conectar-se com o dispositivo
  const connectDevice = async (device: any) => {
    Alert.alert("Funcionalidade não implementada", "A funcionalidade de Bluetooth foi removida deste exemplo");
  };

  // Desconectar-se do dispositivo
  // const disconnectDevice = async (device: any) => {
  //   Alert.alert("Funcionalidade não implementada", "A funcionalidade de Bluetooth foi removida deste exemplo");
  // };

  // Enviar comando LED
  const toggleLED = async (state: boolean) => {
    Alert.alert("Funcionalidade não implementada", "A funcionalidade de Bluetooth foi removida deste exemplo");
  };

  // Enviar mensagem para o display
  const sendDisplayMessage = async (text: string) => {
    Alert.alert("Funcionalidade não implementada", "A funcionalidade de Bluetooth foi removida deste exemplo");
  };

  // Limpar mensagem no display
  const clearDisplayMessage = async () => {
    Alert.alert("Funcionalidade não implementada", "A funcionalidade de Bluetooth foi removida deste exemplo");
  };

  // Atualiza lista de dispositivos dinamicamente
  useEffect(() => {
    // Lista vazia já que não há dispositivos Bluetooth
    setItems([]);
  }, [devices]);

  // Quando o usuário seleciona um dispositivo
  useEffect(() => {
    if (value && !connectedDevice) {
      Alert.alert("Funcionalidade não implementada", "A funcionalidade de Bluetooth foi removida deste exemplo");
    }
  }, [value]);

  // const dropdownPlaceholder = connectedDevice ? `Conectado a: ${connectedDevice.name}` : 'Dispositivos';

  return (

    <View style={styles.container}>

      <View style={{ width: '100%' }}>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>

            <Text style={styles.title}>Controle Bluetooth</Text>

            <Text style={styles.connectedText}>
                {/* {connectedDevice ? `Conectado a ${connectedDevice.name}`: 'Desconectado'} */}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={isScanning ? stopScan : scanDevices}> 
            <Text style={styles.buttonText}>Buscar dispositivos</Text>
          </TouchableOpacity>

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

          {connectedDevice && (
            <View style={{ width: "100%", marginTop: 10 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => disconnectDevice(connectedDevice)}
              >
                <Text style={styles.buttonText}>
                  {/* Desconectar-se de: {connectedDevice.name} */}
                </Text>
              </TouchableOpacity>
            </View>
          )}

      </View>

      <View style={{ width: '100%' }}>

          <View style={styles.messageContainer}>

            {ledState ? 
              <TouchableOpacity style={styles.button} onPress={() => toggleLED(false)}>
                <Text style={styles.buttonText}>Desligar LED</Text>
              </TouchableOpacity>
            : <TouchableOpacity style={styles.button} onPress={() => toggleLED(true)}>
                <Text style={styles.buttonText}>Ligar LED</Text>
              </TouchableOpacity> }
          </View>

          <View style={styles.messageContainer}>

            <TextInput
              style={styles.input}
              placeholder="Digite sua mensagem"
              placeholderTextColor="#666"
              value={message}
              onChangeText={setMessage}
              maxLength={80}/>

            <TouchableOpacity style={styles.button} onPress={() => sendDisplayMessage(message)}>
              <Text style={styles.buttonText}>Enviar Mensagem</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={clearDisplayMessage} style={{ width: '50%', height: 40, backgroundColor: '#ffb54cff', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.buttonText}>Limpar display</Text>
            </TouchableOpacity>
          </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  status: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  connectedText: {
    fontSize: 18,
    color: "#008cffff",
    fontWeight: "normal",
    marginBottom: 20,
  },
  messageContainer: {
    width: '100%',
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 8,
    fontSize: 20,
    color: "#000",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffb54cff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  dropdown: {
    backgroundColor: "#ffb54c",
    borderWidth: 0,
    borderRadius: 4,
    height: 50,
  },
  dropdownContainer: {
    backgroundColor: "#f5f5f5",
    borderWidth: 0,
    borderRadius: 4,
  },
  dropdownLabel: {
    fontSize: 18,
    color: "#ffffff",
  },
  dropdownPlaceholder: {
    fontSize: 18,
    color: "#ffffff",
  },
  selectedItemContainer: {
    backgroundColor: "#a7a7a7",
  },
  selectedItemLabel: {
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default HomeScreen;