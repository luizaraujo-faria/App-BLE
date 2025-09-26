const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adicione estas configurações para BLE
config.resolver.assetExts.push('db');
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-ble-plx': require.resolve('react-native-ble-plx'),
};

module.exports = config;