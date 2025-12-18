type AppError = {
    title: string;
    message: string;
    status?: number | string;
}

export const normalizeApiErrors = (err: any): AppError => {

    if(err?.response){
        const status = err?.response.status;

        switch(status){
        case 400:
            return {
                title: 'Dados inválidos!',
                message: 'Verifique as informações e tente novamente.',
                status,
            };

        case 401:
            return {
                title: 'Sessão expirada!',
                message: 'Faça login novamente para continuar.',
                status,
            };

        case 403:
            return {
                title: 'Acesso negado!',
                message: 'Você não tem permissão para realizar esta ação.',
                status,
            };

        case 404:
            return {
                title: 'Não encontrado!',
                message: 'O recurso solicitado não foi encontrado.',
                status,
            };

        case 500:
        case 502:
        case 503:
            return {
                title: 'Erro no servidor!',
                message: 'Estamos com problemas na comunicação com servidor.',
                status,
            };

        default:
            return {
                title: 'Erro inesperado',
                message: 'Algo deu errado. Tente novamente.',
                status,
            };
        }
    }

    if(err?.request) {
        return {
            title: 'Sem conexão',
            message: 'Verifique sua internet e tente novamente.',
        };
    }

    // Erro desconhecido
    return {
        title: 'Erro',
        message: 'Ocorreu um erro inesperado.',
    };
};