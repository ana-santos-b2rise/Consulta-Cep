class CepConsultor {
    constructor() {
        this.cepInput = document.getElementById('cepInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.loading = document.getElementById('loading');
        this.result = document.getElementById('result');
        this.error = document.getElementById('error');
        
        this.init();
    }

    init() {
        this.searchBtn.addEventListener('click', () => this.buscarCep());
        this.cepInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.buscarCep();
            }
        });

        this.cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }

    async buscarCep() {
        const cep = this.cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            this.mostrarErro('Por favor, digite um CEP válido com 8 dígitos.');
            return;
        }

        this.mostrarLoading();
        this.ocultarResultado();
        this.ocultarErro();

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                this.mostrarErro('CEP não encontrado. Verifique se o CEP está correto.');
                return;
            }

            this.mostrarResultado(data);
        } catch (error) {
            console.error('Erro na consulta:', error);
            this.mostrarErro('Erro ao consultar o CEP. Verifique sua conexão com a internet.');
        } finally {
            this.ocultarLoading();
        }
    }

    mostrarLoading() {
        this.loading.classList.remove('hidden');
    }

    ocultarLoading() {
        this.loading.classList.add('hidden');
    }

    mostrarResultado(data) {
        // Preencher os campos com os dados
        document.getElementById('cepResult').textContent = data.cep;
        document.getElementById('logradouro').textContent = data.logradouro || 'Não informado';
        document.getElementById('bairro').textContent = data.bairro || 'Não informado';
        document.getElementById('cidade').textContent = data.localidade;
        document.getElementById('estado').textContent = data.uf;
        document.getElementById('ddd').textContent = data.ddd || 'Não informado';

        // Mostrar o resultado
        this.result.classList.remove('hidden');
        
        // Scroll suave para o resultado
        this.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    ocultarResultado() {
        this.result.classList.add('hidden');
    }

    mostrarErro(mensagem) {
        document.getElementById('errorMessage').textContent = mensagem;
        this.error.classList.remove('hidden');
        
        // Scroll suave para o erro
        this.error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    ocultarErro() {
        this.error.classList.add('hidden');
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CepConsultor();
});

// Função para validar CEP (pode ser usada externamente)
function validarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8;
}

// Função para formatar CEP
function formatarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
        return cepLimpo.substring(0, 5) + '-' + cepLimpo.substring(5);
    }
    return cep;
} 