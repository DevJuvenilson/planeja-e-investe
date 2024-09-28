const inputs = document.querySelectorAll('#capital-inicial, #aporte-mensal');

inputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value;

        // Remove qualquer caractere que não seja número
        value = value.replace(/\D/g, '');

        // Se houver valor, converte para um número e formata para moeda brasileira
        if (value) {
            value = (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else {
            value = 'R$ 0,00'; // Se o campo estiver vazio
        }

        // Define o valor formatado no input
        e.target.value = value;
    });
});

const porcentagemInput = document.querySelector('#taxa-juros');

porcentagemInput.addEventListener('input', function(e) {
    let value = e.target.value;

    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, '');

    // Se houver valor, converte para porcentagem com duas casas decimais
    if (value) {
        value = (value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
    } else {
        value = '0,00%'; // Se o campo estiver vazio
    }

    // Define o valor formatado no input
    e.target.value = value;
});


const meses = document.getElementById('tempo-meses');
meses.addEventListener('input', calcularAnosDias);

function calcularAnosDias() {
    if (meses.value > 0) {
        const anos = document.getElementById('tempo-anos');
        const dias = document.getElementById('tempo-dias');

        anos.value = (meses.value / 12).toFixed(1);
        dias.value = (meses.value * 30)
    }
}

async function calcularInvestimento(tipoJuros, capitalInicial, meses, aporteMensal, taxaJuros, periodo) {

    if (tipoJuros != null) {
        const capital = await formatarParaNumero(capitalInicial);
        const taxa = await formatarParaNumero(taxaJuros);
        const aporte = await formatarParaNumero(aporteMensal);

        if (tipoJuros === 'juros-compostos') {
            await calcularJurosCompostos(capital, meses, aporte, taxa, periodo);
        } else if (tipoJuros === 'juros-simples') {
            await calcularJurosSimples(capital, meses, aporte, taxa, periodo)
        }
    } else {
        alert('Insira valores válidos')
    };
};

// Corrige a formatação de valores inseridos como moeda
async function formatarParaNumero(valor) {
    return parseFloat(valor.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
}

async function calcularJurosCompostos(capitalInicial, meses, aporteMensal, taxaJuros, periodo) {
    //CALCULO
    if (capitalInicial >= 0 && 
        meses >= 0 && 
        aporteMensal >= 0 && 
        taxaJuros > 0 && 
        periodo != null) {
            
        const taxa = taxaJuros / 100;
        const anos = document.getElementById('tempo-anos');
        const dias = document.getElementById('tempo-dias');

        if (periodo === 'anual') {
            if (aporteMensal > 0) {
                alert('Aporte mensal só pode ser inserido em juros rendidos mensalmente!')
            } else {
                var saldoTotal = capitalInicial * ((1 + taxa) ** anos.value);
            }

        } else if (periodo === 'mensal') {
            if (aporteMensal > 0) {
                var saldoTotal = (capitalInicial * ((1 + taxa) ** meses) + (aporteMensal * (((1 + taxa) ** meses) - 1) / taxa));
            } else {
                var saldoTotal = capitalInicial * ((1 + taxa) ** meses);
            }

        } else if (periodo === 'diario') {
            if (aporteMensal > 0) {
                alert('Aporte mensal só pode ser inserido em juros rendidos mensalmente!')
            } else {
                var saldoTotal = capitalInicial * ((1 + taxa) ** dias.value);
            }
        }

        if (aporteMensal > 0) {
            var jurosRendidos = (saldoTotal - capitalInicial) - aporteMensal * meses;
        } else {
            var jurosRendidos = saldoTotal - capitalInicial;
        }

        const campoSaldoTotal = document.getElementById('valor-calculado');
        const campoJurosGerados = document.getElementById('juros-gerados');

        campoSaldoTotal.innerHTML = `
            <h1>SALDO TOTAL:</h1>
            <p>${saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `;

        campoJurosGerados.innerHTML = `
            <h1>JUROS GERADOS:</h1>
            <p>${jurosRendidos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `
    } else {
        alert('Insira valores válidos!')
    };
};

async function calcularJurosSimples(capitalInicial, meses, aporteMensal, taxaJuros, periodo) {
    //CALCULO
    if (capitalInicial >= 0 &&
        meses >= 0 &&
        aporteMensal >= 0 &&
        taxaJuros > 0 &&
        periodo != null) {

        const taxa = taxaJuros / 100;
        const anos = document.getElementById('tempo-anos');
        const dias = document.getElementById('tempo-dias');

        if (periodo === 'anual') {
            if (aporteMensal > 0) {
                alert('Aporte mensal só pode ser inserido em juros rendidos mensalmente e no regime de juros COMPOSTOS!');
            } else {
                var saldoTotal = parseFloat(capitalInicial) + parseFloat(capitalInicial * taxa * anos.value);
            }

        } else if (periodo === 'mensal') {
            if (aporteMensal > 0) {
                alert('Aporte mensal só pode ser inserido em juros rendidos mensalmente e no regime de juros COMPOSTOS!');
            } else {
                var saldoTotal = parseFloat(capitalInicial) + parseFloat(capitalInicial * taxa * meses);
            }

        } else if (periodo === 'diario') {
            if (aporteMensal > 0) {
                alert('Aporte mensal só pode ser inserido em juros rendidos mensalmente e no regime de juros COMPOSTOS!');
            } else {
                var saldoTotal = parseFloat(capitalInicial) + parseFloat(capitalInicial * taxa * dias.value);
            }

        }

        const jurosRendidos = saldoTotal - parseFloat(capitalInicial);
        const campoSaldoTotal = document.getElementById('valor-calculado');
        const campoJurosGerados = document.getElementById('juros-gerados');

        campoSaldoTotal.innerHTML = `
            <h1>SALDO TOTAL:</h1>
            <p>${saldoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `;

        campoJurosGerados.innerHTML = `
            <h1>JUROS GERADOS:</h1>
            <p>${jurosRendidos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `
    } else {
        alert('Insira valores válidos')
    };
};