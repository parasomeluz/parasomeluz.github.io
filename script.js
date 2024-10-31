// script.js

// Função para calcular o valor com base no pacote selecionado
function calcularValor() {
    const packageSelected = document.getElementById("package").value;

    // Defina os valores dos pacotes aqui
    const packagePrices = {
        "Kit Simples": 50000, // em centavos
        "Kit DJ": 40000,
        "Kit Banda": 100000,
    };

    return packagePrices[packageSelected];
}

// Função para enviar a solicitação de pagamento
async function iniciarPagamento() {
    const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: calcularValor(),
            currency: 'brl' // Moeda
        })
    });

    const { clientSecret } = await response.json();
    processarPagamento(clientSecret);
}

// Função para processar o pagamento
async function processarPagamento(clientSecret) {
    const stripe = Stripe('sua_chave_publica_do_stripe'); // Substitua pela sua chave pública

    // Aqui você deve implementar o elemento do cartão usando a biblioteca Stripe.js
    const cardElement = document.getElementById('card-element'); // Supondo que você tenha um elemento de cartão configurado

    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
                name: document.getElementById("name").value,
                phone: document.getElementById("phone").value
            }
        }
    });

    if (result.error) {
        // Exibe erro no pagamento
        alert(result.error.message);
    } else {
        // Pagamento bem-sucedido
        enviarMensagemWhatsApp();
    }
}

// Função para enviar mensagem via WhatsApp
function enviarMensagemWhatsApp() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const eventDateTime = document.getElementById("eventDateTime").value;
    const eventLocation = document.getElementById("eventLocation").value;
    const packageSelected = document.getElementById("package").value;

    const message = `🟢 Pagamento recebido!\n\n` +
                    `👤 *Nome:* ${name}\n` +
                    `📞 *Telefone:* ${phone}\n` +
                    `📅 *Data e Hora:* ${eventDateTime}\n` +
                    `📍 *Local:* ${eventLocation}\n` +
                    `🎶 *Pacote Selecionado:* ${packageSelected}`;

    const whatsappUrl = `https://wa.me/5547997191945?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
