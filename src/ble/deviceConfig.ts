export const deviceConfig = {
    // UUIDs de exemplo - CONSULTE A DOCUMENTAÇÃO DO SEU DISPOSITIVO
    SERVICE_UUID: "12345678-1234-1234-1234-1234567890ab",
    CHARACTERISTIC_UUID: "abcd1234-5678-1234-5678-1234567890ab",
    
    // Comandos específicos (ajuste conforme seu dispositivo)
    COMMANDS: {
        LED_ON: '1',       // Comando para ligar LED
        LED_OFF: '0',      // Comando para desligar LED
        CLEAR_DISPLAY: `display:${''}\n`, // Comando para limpar display
    }
};