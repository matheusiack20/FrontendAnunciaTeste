import axios from 'axios';


// Função para coletar os dados do usuário
const getUserData = () => {
    // Coletando o identificador do Facebook Pixel
    const fbp = getCookie('_fbp');  // Facebook Pixel ID
    const fbc = getCookie('_fbc');  // Facebook Click ID
    
    // User Agent do navegador

    return {
        fbp: fbp,
        fbc: fbc,
    };
};

// Função para obter o valor de um cookie
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Função para enviar o evento de conversão para o backend
async function sendEventToAPIConversion (event_name, custom_data) {
    const user_data = getUserData();  // Coleta os dados do usuário
    const event_source_url = window.location.href;  // URL da página atual

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}track-event/`, {
            event_name: event_name,
            user_data: user_data,  // Dados do usuário
            custom_data: custom_data,  // Dados personalizados
            event_source_url: event_source_url  // URL de onde o evento ocorreu
        });

        if (response.status === 404) {
            console.error('Track event endpoint not found');
            alert('Track event endpoint not found. Please check the URL or try again later.');
            return;
        }

        console.log(response);
    } catch (error) {
        console.error(`Erro ao enviar evento ${event_name}:`, error.message);
    }
};

// Função para dados personalizados do evento
const getPurchaseData = (plan_name, price) => {
    return {
        plan: plan_name,  // Exemplo de plano
        value: price,  // Exemplo de valor
        currency: 'BRL'  // Moeda
    };
};

const getButtonData = (button_action) => {
    return {
        event: 'button_click',
        button_action: button_action,  // Exemplo de plano
    };
};

const getPageData = (page_action) => {
    return {
        event: 'access_page',
        page_action: page_action,  // Exemplo de plano
    };
};

export const acessouPagMinhaConta = () => {
    fbq('track', 'acessouPagMinhaConta');
    const custom_data = getPageData('Acessou a Pagina Minha Conta')
    sendEventToAPIConversion('acessouPagMinhaConta', custom_data);
};

export const acessouPagAdquirirNovoPlano = () => {
    fbq('track', 'acessouPagAdquirirNovoPlano');
    const custom_data = getPageData('Acessou a Pagina Adquirir Novo Plano')
    sendEventToAPIConversion('acessouPagAdquirirNovoPlano', custom_data);
};

export const acessouPagConsumoPacote = () => {
    fbq('track', 'acessouPagConsumoPacote');
    const custom_data = getPageData('Acessou a Pagina Consumo de Pacote')
    sendEventToAPIConversion('acessouPagConsumoPacote', custom_data);
};

export const acessouPagMinhasFaturas = () => {
    fbq('track', 'acessouPagMinhasFaturas');
    const custom_data = getPageData('Acessou a Pagina Minhas Faturas')
    sendEventToAPIConversion('acessouPagMinhasFaturas', custom_data);
};

export const acessouPagFaleConosco = () => {
    fbq('track', 'acessouPagFaleConosco');
    const custom_data = getPageData('Acessou a Pagina Fale Conosco')
    sendEventToAPIConversion('acessouPagFaleConosco', custom_data);
};

export const acessouPagManual = () => {
    fbq('track', 'acessouPagManual');
    const custom_data = getPageData('Acessou a Pagina de Manual')
    sendEventToAPIConversion('acessouPagManual', custom_data);
};

export const acessouConexoes = () => {
    fbq('track', 'acessouConexoes');
    const custom_data = getPageData('Acessou a Pagina de Conexoes')
    sendEventToAPIConversion('acessouConexoes', custom_data);
};

export const gerouAnuncio = () => {
    fbq('track', 'gerouAnuncio');
    const custom_data = getButtonData('Gerou um Anuncio')
    sendEventToAPIConversion('gerouAnuncio', custom_data);
};

export const cadastrouAnuncio = () => {
    fbq('track', 'cadastrouAnuncio');
    const custom_data = getButtonData('Cadastrou um Anuncio em HUBs')
    sendEventToAPIConversion('cadastrouAnuncio', custom_data);
};

// Evento disparado quando o usuário assina o plano iniciante anual
export const assinouPlanoInicianteAnual = () => {
    fbq('track', 'assinouPlanoInicianteAnual');
    const custom_data = getPurchaseData('Plano Iniciante Anual', 572.40)
    sendEventToAPIConversion('assinouPlanoInicianteAnual', custom_data);
};

// Evento disparado quando o usuário assina o plano iniciante mensal
export const assinouPlanoInicianteMensal = () => {
    fbq('track', 'assinouPlanoInicianteMensal');
    const custom_data = getPurchaseData('Plano Iniciante Mensal', 57.70)
    sendEventToAPIConversion('assinouPlanoInicianteMensal',custom_data);
};

// Evento disparado quando o usuário assina o plano especialista anual
export const assinouPlanoEspecialistaAnual = () => {
    fbq('track', 'assinouPlanoEspecialistaAnual');
    const custom_data = getPurchaseData('Plano Especialista Anual', 2844)
    sendEventToAPIConversion('assinouPlanoEspecialistaAnual', custom_data);
};

// Evento disparado quando o usuário assina o plano especialista mensal
export const assinouPlanoEspecialistaMensal = () => {
    fbq('track', 'assinouPlanoEspecialistaMensal');
    const custom_data = getPurchaseData('Plano Especialista Mensal', 284)
    sendEventToAPIConversion('assinouPlanoEspecialistaMensal', custom_data);
};

// Evento disparado quando o usuário assina o plano pro anual
export const assinouPlanoProAnual = () => {
    fbq('track', 'assinouPlanoProAnual');
    const custom_data = getPurchaseData('Plano Pro Anual', 4688.40)
    sendEventToAPIConversion('assinouPlanoProAnual', custom_data);
};

// Evento disparado quando o usuário assina o plano pro mensal
export const assinouPlanoProMensal = () => {
    fbq('track', 'assinouPlanoProMensal');
    const custom_data = getPurchaseData('Plano Pro Mensal', 468.90)
    sendEventToAPIConversion('assinouPlanoProMensal', custom_data);
};
