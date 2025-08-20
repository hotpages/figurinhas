// Elementos do HTML que vamos manipular
const categoriasContainer = document.getElementById('categorias-container');
const figurinhasContainer = document.getElementById('figurinhas-container');

/**
 * Mostra as figurinhas de uma categoria específica na tela.
 * @param {object} categoria - O objeto da categoria clicada.
 * @param {Array} todasCategorias - A lista completa de todas as categorias.
 */
function mostrarFigurinhas(categoria, todasCategorias) {
    // Limpa o container de figurinhas antes de adicionar novas
    figurinhasContainer.innerHTML = '';

    // Encontra o objeto completo da categoria para garantir que temos a lista de figurinhas
    const categoriaCompleta = todasCategorias.find(c => c.pasta === categoria.pasta);

    if (!categoriaCompleta || !categoriaCompleta.figurinhas) {
        console.error("Figurinhas para a categoria não encontradas:", categoria.pasta);
        return;
    }

    // Para cada nome de arquivo de figurinha, cria um card HTML
    categoriaCompleta.figurinhas.forEach(nomeArquivo => {
        const caminhoCompleto = `figurinhas/${categoriaCompleta.pasta}/${nomeArquivo}`;
        
        const card = document.createElement('div');
        card.className = 'figurinha-card';

        // O HTML de cada card de figurinha
        card.innerHTML = `
            <img src="${caminhoCompleto}" alt="${nomeArquivo}" loading="lazy">
            <div class="botoes-container">
                <a href="${caminhoCompleto}" download="${nomeArquivo}" class="btn-baixar">
                    <span class="material-icons" style="font-size:18px;">download</span>
                    Baixar
                </a>
                <a href="${caminhoCompleto}" target="_blank" class="btn-visualizar">
                    <span class="material-icons" style="font-size:18px;">visibility</span>
                    Visualizar
                </a>
            </div>
        `;
        
        figurinhasContainer.appendChild(card);
    });
}

/**
 * Cria os botões para cada categoria encontrada no arquivo JSON.
 * @param {Array} categorias - A lista de categorias carregada do JSON.
 */
function criarBotoesCategoria(categorias) {
    categorias.forEach(cat => {
        const botao = document.createElement('button');
        botao.className = 'categoria-btn';
        
        // Adiciona o ícone de pasta com a cor definida
        botao.innerHTML = `<span class="material-icons folder-icon" style="color: ${cat.corIcone};">folder</span> ${cat.nome}`;

        // Adiciona o evento de clique para mostrar as figurinhas daquela categoria
        botao.onclick = () => mostrarFigurinhas(cat, categorias);
        
        categoriasContainer.appendChild(botao);
    });
}

/**
 * Função principal que inicia o site.
 * Ela busca e carrega o arquivo 'figurinhas.json'.
 */
async function iniciar() {
    try {
        // Busca o arquivo JSON gerado pelo script Python
        const resposta = await fetch('js/figurinhas.json');
        
        // Verifica se o arquivo foi encontrado e está acessível
        if (!resposta.ok) {
            throw new Error(`Erro HTTP! Status: ${resposta.status}`);
        }
        
        const categorias = await resposta.json();
        
        // Se o JSON estiver vazio ou não for um array, mostra um aviso
        if (!Array.isArray(categorias) || categorias.length === 0) {
            figurinhasContainer.innerHTML = `<p style="text-align:center;">Nenhuma categoria de figurinha foi encontrada. Execute o script 'gerar_lista.py' e envie os arquivos para o GitHub.</p>`;
            return;
        }
        
        // Cria os botões das categorias na tela
        criarBotoesCategoria(categorias);
        
        // Por padrão, mostra as figurinhas da primeira categoria da lista
        mostrarFigurinhas(categorias[0], categorias);

    } catch (error) {
        console.error("Falha ao carregar ou processar o arquivo de figurinhas:", error);
        figurinhasContainer.innerHTML = `<p style="text-align:center;">Erro ao carregar as figurinhas. Verifique se o arquivo 'js/figurinhas.json' existe e está correto.</p>`;
    }
}

// Adiciona um 'ouvinte' para executar a função 'iniciar' assim que a página carregar
document.addEventListener('DOMContentLoaded', iniciar);
