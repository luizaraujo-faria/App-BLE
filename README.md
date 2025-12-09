# APP com BLE (Bluetooth Low Energy)

-   Aplicativo Mobile baseado em ReactNative utilizando lib de BLE(Bluetooth Low Energy) para
    comunicação com hardware.

-   O aplicativo será destinado a um projeto de registros de crachás de funcionários ao passarem
    por catracas, onde os dados do funcionário serão enviados para o app via Bluetooth e salvos em 
    memória e posteriormente enviados e salvos no banco de dados.

# Ferramentas

-   React-Native (TypeScript + Expo-Router)
-   Expo
-   React-Native-Ble-Plx
-   Git

# Pastas e Arquivos

APP-BLE/

    ├── assets/ - Midia geral (Imagens, Icones, Fonts e etc.)

        ├── fonts/
        ├── images/

    ├── src/ - Código principal da aplicação
        
        ├── app/ - Código principal das telas pelo modelo Expo-Router

            ├── _layout.tsx - Layout e navegação do Expo-Router
            ├── index.tsx - Tela inicial de Login
            ├── (tabs)/

                ├── home.tsx - Página de listagem e recebimento de dados.
                ├── management.tsx - Página de dashboard dos dados.
                ├── settings.tsx - Página de configuração e conexão com bluetooth.

        ├── ble/ - Configurações do React-Native-Ble-Plx

            ├── BleService.ts - Instância única da classe BleManager e seus serviços
            ├── bleTypes.ts - Definição dos tipos dos objetos e propriedades da biblioteca

        ├── components/

            ├── layout/
            ├── ui/

        ├── contexts/ - Contextos criados para o app

            ├── BleContext.tsx - BleProvider para permitir o uso do BLE por todo o app

        ├── hooks/ - Hooks personalizados

            ├── useBle.ts - Hook para a utilização do bleService (Objeto Central da lib)

        ├── services/ - Consumo de serviços da API.

            ├── api.ts - Configuração da API base.
            ├── recordsService.ts - Rotas e endpoints do registros.
    
    ├── app.json - Configurações do app
    ├── eas.json - Configurações de build
    ├── tsconfig.json - Configurações do TypeScript

# Build

-   Expo Bare Workflow
-   Apk para android

-   eas build --platform android --profile local --clear-cache
-   eas build --platform android --profile development
-   npx expo start --dev-client


- 1º Build inicial (uma vez)
eas build --profile development --platform android

- Desenvolvimento diário (múltiplas vezes ao dia)
eas update --branch development

- Quando adicionar novas dependências nativas
npx expo install nova-dependencia
eas build --profile development --platform android
eas build -p android --profile production