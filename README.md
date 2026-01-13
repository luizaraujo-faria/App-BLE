# Aplicativo - IMREA Nutrição

-   Aplicativo Mobile desenvolvido em React-Native + Expo-Router para gerencia de fluxo e passagens
    pelo refeitório do IMREA Rede Lucy Montoro.

-   O app permite receber dados de crachas de colaboradores vindos de um ESP32, listalos e envia-los para
    a API Destinada ao app que redirecionará os dados para o Google Sheets. Fornece painel de configuração
    e conexão via BLE (Bluetooth-Low-Energy). Cadastro de colaboradores através do app e vizualização dos
    dados da planilha através de dashboard com gráficos.

-   O projeto visa reduzir custos e trabalho manual repetitivo, permitindo que o fluxo do refeitório seja
    gerenciado e mantido de maneira automatizada e controlada. Desse modo reduzindo drasticamente o uso de planilhas e registros físicos.

-   Partindo de uma iniciativa interna do setor da Biengenharia do IMREA Vila Mariana, chefiado pelo Engenheiro
    Daniel Tamashiro, coordenado pelo Analista Lucas Donato e desenvolvido pelo Bolsita e Desenvolvedor Luiz Henrique Araujo.

# Principais Ferramentas

-   React-Native (TypeScript).
-   Expo (Expo-Router).
-   React-Native-Ble-Plx (Lib para BLE).
-   React-Native-Gifted-Charts (Lib para Gráficos).
-   React-Native-Dropdown-Picker (Lib para Dropdown).
-   Expo-Linear-Gradient (Lib para Gradiente).
-   Expo-Vector-Icons (Lib para Icones Vetorizados).
-   Expo-Fonts (Lib para Fontes de Texto).
-   Pnpm (Gerenciador de pacotes).
-   Git.

# Pastas e Arquivos

APP-BLE/

    ├── assets/ - Midia geral (Imagens, Icones, Fonts e etc.)

        ├── fonts/
        ├── images/

    ├── patches/ - Alteração manual na lib React-Native-BLE-PLX.

    ├── src/ - Código principal da aplicação
        
        ├── app/ - Código principal das telas.

            ├── _layout.tsx - Layout e navegação base.
            ├── index.tsx - Tela inicial de Login
            ├── (tabs)/

                ├── _layout.tsx - Layout de configuração e navegação em Tab-Bar.
                ├── list.tsx - Tela de listagem e recebimento de dados de entrada e saída.
                ├── management.tsx - Tela de dashboard dos dados do refeitório.
                ├── register.tsx - Tela de cadastro de colaboradores.
                ├── settings.tsx - Tela de configuração e conexão com bluetooth.

        ├── ble/ - Configurações do React-Native-Ble-Plx.

            ├── BleService.ts - Instância única da classe BleManager e seus serviços.
            ├── bleTypes.ts - Definição dos tipos dos objetos e propriedades da biblioteca.

        ├── components/

            ├── Cada componente está dentro de uma pasta com seu nome - contendo dentro dela uma arquivo index.tsx e style.ts.

        ├── contexts/ - Contextos globais do app.

            ├── BleContext.tsx - BleProvider para permitir o uso do BLE por todo o app.
            ├── ListContext.tsx - ListProvider para contagem dos itens dentro da lista e exibição visual.
            ├── PopupContext.tsx - PopupProvider para captura e exibição de erros pelo app.

        ├── hooks/ - Hooks personalizados

            ├── useBle.ts - Hook para a utilização do bleService (Objeto Central da lib).
            ├── useChart.ts - Hook para a utilização dos gráficos no dashboard.
            ├── useDeviceToggle.ts - Hook para a utilização dos switches nas configurações.
            ├── useDropdown.ts - Hook para a utilização dos dropdowns pelo app.

        ├── security/ - Guarda funções para requisição de permissões ao OS.

        ├── services/ - Consumo de serviços da API.

            ├── api.ts - Configuração base da API.
            ├── apiErrors.ts - Normalização e tratamento de erros vindos da API.
            ├── collaboratorService.ts - Rotas e endpoints dos colaboradores.
            ├── recordsService.ts - Rotas e endpoints dos registros de entrada e saída.

        ├── themes/ - Centralização de estilos globais.

            ├── colors/ - Cores padronizadas do app.
            ├── fonts/ - Fontes padronizadas do app.

        ├── types/ - Tipos das entidades do app.

    ├── app.json - Configurações do app.
    ├── eas.json - Configurações de build.
    ├── babel.config.js - COnfigurações do babel para plugins.
    ├── tsconfig.json - Configurações do TypeScript.

# Build

-   O projeto pode ser testado e desenvolvido de maneira simples utilizando o app Expo Go fornecido
    gratuitamente pelo Expo. No entando esse método oferece suporte apenas as bibliotecas mantidas pelo ecossistema Expo.

-   Portanto se precisar testar bibliotecas que utilizam código e funcionalidades nativas do Sistema
    Operacional como (Bluetooth,Localização, câmera etc.), deve-se utilizar o Expo Bare Workflow. Este método gerará as pastas Android e ou IOS com seus respectivos códigos nativos. Segue a instalação e configuração:

        - pnpm add -g expo-cli.
        - pnpm add -g eas-cli.
        
        - Android Studio deve estar instalado e configurado.
        - XCode para IOS (Apenas em MacOS).

        - npx expo prebuild - gerará as pastas Android e/ou IOS.

        EAS
        - eas login - Pedirá login com sua conta do Expo via terminal.
        - eas build:configure - Gera eas.config e configura credenciais automaticamente.

        - eas build --profile development --platform android - Gera APK de desenvolvimento (Android).
        - eas build --profile production --platform android - Gera APK de produção (Android, sem debug).
        - eas build -p ios --profile production - Gera IPA de produção (Requer conta na Apple Developer).

    - Desenvolvimento diário (múltiplas vezes ao dia)
    eas update --branch development

-   Um novo build deverá ser gerado toda vez que adicionar uma nova biblioteca que utiliza código nativo
    ou quando alterar diretamente o código nativo do app.