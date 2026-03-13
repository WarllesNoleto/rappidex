export enum messageTypes {
    motoboy = 'motoboy',
    client = 'client',
    establishment = 'establishment',
}

const messages = {
    // Olá, tudo bem? Aqui é do Rappidex.
    [messageTypes.motoboy]: 'Ol%C3%A1%2C%20tudo%20bem%3F%20Aqui%20%C3%A9%20do%20Rappidex.',
    // Olá, tudo bem? Sou o entregadir do Rappidex, preciso da sua lovalização para fazer a entrega do seu pedido!
    [messageTypes.client]: 'Ol%C3%A1%2C%20tudo%20bem%3F%20Sou%20o%20entregador%20do%20Rappidex%2C%20preciso%20da%20sua%20localiza%C3%A7%C3%A3o%20para%20fazer%20a%20entrega%20do%20seu%20pedido%21',
    // Olá, tudo bem? Está tudo certo com o pedido do meu estabelecimento?
    [messageTypes.establishment]: 'Ol%C3%A1%2C%20tudo%20bem%3F%20Est%C3%A1%20tudo%20certo%20com%20o%20pedido%20do%20meu%20estabelecimento%3F'
}

const apiWhatsapp = 'https://wa.me';

export const getLinkToWhatsapp = (phone: string, type: messageTypes) => `${apiWhatsapp}/55${phone}?text=${messages[type]}`