// Elementos do HTML que vamos manipular
const categoriasContainer = document.getElementById('categorias-container');
const figurinhasContainer = document.getElementById('figurinhas-container');
const loadingSpinner = document.getElementById('loading-spinner');

/**
 * Mostra as figurinhas de uma categoria específica na tela.
 */
function mostrarFigurinhas(categoria, todasCategorias) {
    loadingSpinner.style.display = 'block'; // Mostra o spinner
    figurinhasContainer.innerHTML = ''; // Limpa as figurinhas antigas

    // Simula um pequeno atraso para a animação ser perceptível
    setTimeout(() => {
        const categoriaCompleta = todasCategorias.find(c => c.pasta === categoria.pasta);

        if (!categoriaCompleta || !categoriaCompleta.figurinhas) {
            console.error("Figurinhas para a categoria não encontradas:", categoria.pasta);
            loadingSpinner.style.display = 'none';
            return;
        }

        categoriaCompleta.figurinhas.forEach(nomeArquivo => {
            const caminhoCompleto = `figurinhas/${categoriaCompleta.pasta}/${nomeArquivo}`;
            const card = document.createElement('div');
            card.className = 'figurinha-card';

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

        loadingSpinner.style.display = 'none'; // Esconde o spinner
    }, 250); // Atraso de 250ms
}

/**
 * Cria os botões para cada categoria e gerencia o estado ativo.
 */
function criarBotoesCategoria(categorias) {
    categorias.forEach(cat => {
        const botao = document.createElement('button');
        botao.className = 'categoria-btn';
        botao.innerHTML = `<span class="material-icons folder-icon" style="color: ${cat.corIcone};">folder</span> ${cat.nome}`;

        botao.onclick = () => {
            // Remove a classe 'active' de todos os outros botões
            document.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' apenas ao botão clicado
            botao.classList.add('active');
            
            mostrarFigurinhas(cat, categorias);
        };
        
        categoriasContainer.appendChild(botao);
    });
}

/**
 * Função principal que inicia o site.
 */
async function iniciar() {
    loadingSpinner.style.display = 'block';
    try {
        const resposta = await fetch('js/figurinhas.json?v=' + new Date().getTime()); // Evita cache
        if (!resposta.ok) throw new Error(`Erro HTTP! Status: ${resposta.status}`);
        
        const categorias = await resposta.json();
        
        if (!Array.isArray(categorias) || categorias.length === 0) {
            figurinhasContainer.innerHTML = `<p style="text-align:center;">Nenhuma categoria encontrada. Execute o script 'gerar_lista.py'.</p>`;
            loadingSpinner.style.display = 'none';
            return;
        }
        
        criarBotoesCategoria(categorias);
        
        // Ativa o primeiro botão e mostra suas figurinhas
        const primeiroBotao = document.querySelector('.categoria-btn');
        if (primeiroBotao) {
            primeiroBotao.classList.add('active');
            mostrarFigurinhas(categorias[0], categorias);
        } else {
             loadingSpinner.style.display = 'none';
        }

    } catch (error) {
        console.error("Falha ao carregar o arquivo de figurinhas:", error);
        figurinhasContainer.innerHTML = `<p style="text-align:center;">Erro ao carregar as figurinhas. Verifique o arquivo 'js/figurinhas.json'.</p>`;
        loadingSpinner.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', iniciar);
