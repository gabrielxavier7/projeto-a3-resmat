/**
 * app.js
 * Controle principal da aplicação
 * Gerencia interações com DOM, validações, eventos e fluxo de dados
 */

// Constantes de seletores CSS
const SELETOR_FORMULARIO = '#formularioAnalise';
const SELETOR_BTN_CALCULAR = '#btnCalcular';
const SELETOR_BTN_LIMPAR = '#btnLimpar';
const SELETOR_BTN_EXEMPLO = '#btnExemplo';
const SELETOR_BTN_RELATORIO = '#btnRelatorio';
const SELETOR_RESULTADO = '#secaoResultados';
const SELETOR_DIAGRAMA = '#secaoDiagrama';
const SELETOR_RELATORIO_DISPLAY = '#relatorioDisplay';
const SELETOR_STATUS_FINAL = '#statusFinal';
const SELETOR_DIAGNOSTICO = '#diagnostico';

// Dados de exemplo para preencher automaticamente
const DADOS_EXEMPLO = {
  peso: 90,
  altura: 90,
  larguraAssento: 45,
  profundidade: 45,
  espessura: 6.06,
  formato: 'quadrada',
  material: 'madeira',
  fatorSeguranca: 2
};

// Variável global para armazenar últimos resultados
let ultimosResultados = null;

/**
 * Valida um campo de entrada numérica
 * @param {string} valor - Valor a validar
 * @param {number} minimo - Valor mínimo permitido (greater than)
 * @returns {object} Objeto com propriedades: valido (boolean), erro (string)
 */
function validarNumeroPosivo(valor, minimo = 0) {
  if (valor === '' || valor === null || valor === undefined) {
    return { valido: false, erro: 'Campo obrigatório' };
  }

  const numero = parseFloat(valor);

  if (isNaN(numero)) {
    return { valido: false, erro: 'Deve ser um número válido' };
  }

  if (numero <= minimo) {
    return { valido: false, erro: `Deve ser maior que ${minimo}` };
  }

  return { valido: true, erro: '' };
}

/**
 * Valida todos os campos do formulário
 * @returns {object} Objeto com propriedades: valido (boolean), erros (array)
 */
function validarFormulario() {
  const erros = [];

  // Peso da pessoa
  const validacaoPeso = validarNumeroPosivo(document.getElementById('peso').value, 0);
  if (!validacaoPeso.valido) {
    erros.push('Peso: ' + validacaoPeso.erro);
  }

  // Altura da cadeira
  const validacaoAltura = validarNumeroPosivo(document.getElementById('altura').value, 0);
  if (!validacaoAltura.valido) {
    erros.push('Altura da cadeira: ' + validacaoAltura.erro);
  }

  // Largura do assento
  const validacaoLargura = validarNumeroPosivo(document.getElementById('larguraAssento').value, 0);
  if (!validacaoLargura.valido) {
    erros.push('Largura do assento: ' + validacaoLargura.erro);
  }

  // Profundidade do assento
  const validacaoProfundidade = validarNumeroPosivo(document.getElementById('profundidade').value, 0);
  if (!validacaoProfundidade.valido) {
    erros.push('Profundidade do assento: ' + validacaoProfundidade.erro);
  }

  // Espessura da perna
  const validacaoEspessura = validarNumeroPosivo(document.getElementById('espessura').value, 0);
  if (!validacaoEspessura.valido) {
    erros.push('Espessura da perna: ' + validacaoEspessura.erro);
  }

  // Fator de segurança
  const validacaoFator = validarNumeroPosivo(document.getElementById('fatorSeguranca').value, 0);
  if (!validacaoFator.valido) {
    erros.push('Fator de segurança: ' + validacaoFator.erro);
  }

  return {
    valido: erros.length === 0,
    erros: erros
  };
}

/**
 * Exibe mensagens de erro na interface
 * @param {array} erros - Array com mensagens de erro
 */
function exibirErros(erros) {
  // Limpar erros anteriores
  const containerErros = document.getElementById('containerErros');
  if (containerErros) {
    containerErros.remove();
  }

  if (erros.length === 0) return;

  // Criar container de erros
  const divErros = document.createElement('div');
  divErros.id = 'containerErros';
  divErros.className = 'container-erros';
  divErros.innerHTML = `
    <h4>⚠️ Erros encontrados:</h4>
    <ul>
      ${erros.map(erro => `<li>${erro}</li>`).join('')}
    </ul>
  `;

  // Inserir no início do formulário
  const formulario = document.querySelector(SELETOR_FORMULARIO);
  formulario.insertBefore(divErros, formulario.firstChild);

  // Auto-remover após 5 segundos
  setTimeout(() => {
    if (divErros.parentNode) {
      divErros.remove();
    }
  }, 5000);
}

/**
 * Coleta dados do formulário e retorna em um objeto
 * @returns {object} Objeto com os dados preenchidos
 */
function coletarDadosFormulario() {
  return {
    peso: parseFloat(document.getElementById('peso').value),
    altura: parseFloat(document.getElementById('altura').value),
    larguraAssento: parseFloat(document.getElementById('larguraAssento').value),
    profundeAssento: parseFloat(document.getElementById('profundidade').value),
    espessuraPerna: parseFloat(document.getElementById('espessura').value),
    formato: document.getElementById('formato').value,
    material: document.getElementById('material').value,
    fatorSeguranca: parseFloat(document.getElementById('fatorSeguranca').value)
  };
}

/**
 * Formata número para exibição com unidades
 * @param {number} valor - Valor a formatar
 * @param {string} unidade - Unidade do valor
 * @param {number} casas - Casas decimais
 * @returns {string} Valor formatado com unidade
 */
function formatarComUnidade(valor, unidade, casas = 2) {
  return `${parseFloat(valor).toFixed(casas)} ${unidade}`;
}

/**
 * Atualiza o cartão do exemplo pré-definido com os valores e o status
 * @param {object} resultados - objeto retornado por analisarCadeira()
 */
function atualizarCartaoExemplo(resultados) {
  const el = document.getElementById('exemploPadrao');
  if (!el) return;

  // Preencher inputs básicos
  document.getElementById('exemploEspessura').textContent = `${DADOS_EXEMPLO.espessura}` + ' cm';
  document.getElementById('exemploFormato').textContent = DADOS_EXEMPLO.formato === 'quadrada' ? 'Quadrada' : 'Circular';
  document.getElementById('exemploMaterial').textContent = DADOS_EXEMPLO.material.charAt(0).toUpperCase() + DADOS_EXEMPLO.material.slice(1);
  document.getElementById('exemploFS').textContent = `${DADOS_EXEMPLO.fatorSeguranca}x`;

  // Se tiver resultados, atualizar status
  const badge = document.getElementById('exemploBadge');
  if (resultados && resultados.seguranca) {
    if (resultados.seguranca.seguro) {
      badge.className = 'badge-seguro';
      badge.textContent = '✓ Seguro';
    } else {
      badge.className = 'badge-inseguro';
      badge.textContent = '✗ Não seguro';
    }
  }
}

/**
 * Renderiza a seção de resultados na interface
 * @param {object} resultados - Objeto retornado por analisarCadeira()
 */
function exibirResultados(resultados) {
  ultimosResultados = resultados;

  const secaoResultados = document.querySelector(SELETOR_RESULTADO);
  const entrada = resultados.entrada;
  const material = resultados.material;
  const seguranca = resultados.seguranca;

  // Determinar classe CSS para o status final
  const classStatus = seguranca.seguro ? 'badge-seguro' : 'badge-inseguro';
  const textoStatus = seguranca.seguro ? '✓ SEGURA' : '✗ NÃO SEGURA';

  // HTML da seção de resultados
  const htmlResultados = `
    <div class="resultado-header">
      <h2>Resultados da Análise</h2>
      <div class="status-final ${classStatus}">
        ${textoStatus}
      </div>
    </div>

    <div class="grid-resultados">
      <!-- CARD 1: DADOS RESUMIDOS -->
      <div class="card-resultado">
        <h3>Dados Resumidos</h3>
        <div class="resultado-item">
          <span class="label">Pessoa:</span>
          <span class="valor">${formatarComUnidade(entrada.peso, 'kg')}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Material:</span>
          <span class="valor">${material.nome}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Formato perna:</span>
          <span class="valor">${entrada.formato === 'quadrada' ? 'Quadrada' : 'Circular'}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Fator segurança:</span>
          <span class="valor">${formatarComUnidade(entrada.fatorSeguranca, 'x', 1)}</span>
        </div>
      </div>

      <!-- CARD 2: FORÇAS -->
      <div class="card-resultado">
        <h3>Forças (N)</h3>
        <div class="resultado-item">
          <span class="label">Força total:</span>
          <span class="valor">${formatarComUnidade(resultados.forcaTotal, 'N')}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Por perna:</span>
          <span class="valor">${formatarComUnidade(resultados.forcaPerna, 'N')}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Área seção:</span>
          <span class="valor">${formatarComUnidade(resultados.areaSecao.areaMM2, 'mm²')}</span>
        </div>
      </div>

      <!-- CARD 3: TENSÕES -->
      <div class="card-resultado">
        <h3>Tensões (MPa)</h3>
        <div class="resultado-item">
          <span class="label">Compressão:</span>
          <span class="valor">${formatarComUnidade(resultados.tensaoNormal, 'MPa')}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Limite compressão:</span>
          <span class="valor">${formatarComUnidade(material.tensaoLimiteCompressao, 'MPa')}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Flexão:</span>
          <span class="valor">${formatarComUnidade(resultados.tensaoFlexao, 'MPa')}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Limite flexão:</span>
          <span class="valor">${formatarComUnidade(material.tensaoLimiteFlexao, 'MPa')}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Cisalhamento:</span>
          <span class="valor">${formatarComUnidade(resultados.tensaoCisalhamento, 'MPa')}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Limite cisalhamento:</span>
          <span class="valor">${formatarComUnidade(material.tensaoLimiteCisalhamento, 'MPa')}</span>
        </div>
      </div>

      <!-- CARD 4: GRANDEZAS GEOMÉTRICAS -->
      <div class="card-resultado">
        <h3>Geometria</h3>
        <div class="resultado-item">
          <span class="label">Momento fletor:</span>
          <span class="valor">${formatarComUnidade(resultados.momentoFletor, 'N·m', 4)}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Momento torsor (assumido):</span>
          <span class="valor">${formatarComUnidade(resultados.momentoTorsor.torsaoAssumida, 'N·m', 4)}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Tensão por torção (assumida):</span>
          <span class="valor">${formatarComUnidade(resultados.tensaoTorsaoAssumida, 'MPa', 4)}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Momento torsor (máx):</span>
          <span class="valor">${formatarComUnidade(resultados.momentoTorsor.torsaoMaxima, 'N·m', 4)}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Tensão por torção (máx):</span>
          <span class="valor">${formatarComUnidade(resultados.tensaoTorsaoMaxima, 'MPa', 4)}</span>
        </div>
        <div class="resultado-item">
          <span class="label">Momento inércia:</span>
          <span class="valor">${(resultados.inercia * 1e8).toFixed(4)} × 10⁻⁸ m⁴</span>
        </div>
        <div class="resultado-item">
          <span class="label">Distância fibra:</span>
          <span class="valor">${formatarComUnidade(resultados.distanciaFibra * 100, 'cm', 3)}</span>
        </div>
      </div>

      <!-- CARD 5: DIAGNÓSTICO -->
      <div class="card-resultado card-diagnostico">
        <h3>📋 Diagnóstico</h3>
        <div id="diagnostico" class="diagnostico-content">
          <!-- Preenchido em tempo real -->
        </div>
      </div>

      <!-- CARD 6: VERIFICAÇÕES -->
      <div class="card-resultado">
        <h3>✓ Verificações</h3>
        <div class="resultado-item ${seguranca.compressaoOK ? 'ok' : 'erro'}">
          <span class="label">Compressão:</span>
          <span class="valor">${seguranca.compressaoOK ? '✓ Aprovado' : '✗ Reprovado'}</span>
        </div>
        <div class="resultado-item ${seguranca.flexaoOK ? 'ok' : 'erro'}">
          <span class="label">Flexão:</span>
          <span class="valor">${seguranca.flexaoOK ? '✓ Aprovado' : '✗ Reprovado'}</span>
        </div>
        <div class="resultado-item ${seguranca.cisalhamentoOK ? 'ok' : 'erro'}">
          <span class="label">Cisalhamento:</span>
          <span class="valor">${seguranca.cisalhamentoOK ? '✓ Aprovado' : '✗ Reprovado'}</span>
        </div>
        <div class="resultado-item ${seguranca.torsaoMaxOK ? 'ok' : 'erro'}">
          <span class="label">Torção (máx):</span>
          <span class="valor">${seguranca.torsaoMaxOK ? '✓ Aprovado' : '✗ Reprovado'}</span>
        </div>
        <div class="resultado-item" style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px;">
          <span class="label">Status Geral:</span>
          <span class="valor ${seguranca.seguro ? 'ok' : 'erro'} forte">
            ${seguranca.seguro ? '✓ SEGURA' : '✗ NÃO SEGURA'}
          </span>
        </div>
      </div>
    </div>

    <div class="botoes-resultado">
      <button id="btnRelatorio" class="btn btn-relatorio" onclick="gerarRelatorio()">
        📄 Gerar Relatório Completo
      </button>
    </div>
  `;

  secaoResultados.innerHTML = htmlResultados;
  secaoResultados.style.display = 'block';

  const secaoDiagrama = document.querySelector(SELETOR_DIAGRAMA);
  if (secaoDiagrama) {
    secaoDiagrama.style.display = 'block';
    const momentoTexto = document.getElementById('momentoMaximoTexto');
    if (momentoTexto) {
      momentoTexto.textContent = `${resultados.momentoFletor.toFixed(3)} N·m`;
    }

    if (typeof drawMomentoFletor === 'function') {
      drawMomentoFletor('momentoCanvas', resultados.momentoFletor);
    }
  }

  // Preencher diagnóstico
  const diagnostico = gerarDiagnostico(resultados);
  const elDiagnostico = document.getElementById('diagnostico');
  
  let diagHTML = `
    <div class="diag-item diag-${diagnostico.compressao.includes('✓') ? 'ok' : 'erro'}">
      ${diagnostico.compressao}
    </div>
    <div class="diag-item diag-${diagnostico.flexao.includes('✓') ? 'ok' : 'erro'}">
      ${diagnostico.flexao}
    </div>
    <div class="diag-item">
      ${diagnostico.cisalhamento}
    </div>
    <div class="diag-item">
      ${diagnostico.torsao}
    </div>
  `;

  if (diagnostico.recomendacoes.length > 0) {
    diagHTML += '<div class="diag-recomendacoes"><strong>Recomendações:</strong><ul>';
    diagnostico.recomendacoes.forEach(rec => {
      diagHTML += `<li>• ${rec}</li>`;
    });
    diagHTML += '</ul></div>';
  }

  elDiagnostico.innerHTML = diagHTML;

  // Atualizar cartão do exemplo com o último resultado
  atualizarCartaoExemplo(resultados);

  // Scroll suave até os resultados
  setTimeout(() => {
    secaoResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

/**
 * Gera e exibe o relatório textual completo
 */
function gerarRelatorio() {
  if (!ultimosResultados) {
    alert('Execute a análise primeiro');
    return;
  }

  const texto = gerarRelatorioTexto(ultimosResultados);
  const areaRelatorio = document.getElementById('relatorioTexto');
  
  if (areaRelatorio) {
    areaRelatorio.value = texto;
    document.getElementById('secaoRelatorio').style.display = 'block';
    areaRelatorio.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Copia o conteúdo do relatório para a área de transferência
 */
function copiarRelatorio() {
  const areaRelatorio = document.getElementById('relatorioTexto');
  if (areaRelatorio) {
    areaRelatorio.select();
    document.execCommand('copy');
    alert('Relatório copiado para a área de transferência!');
  }
}

/**
 * Preenche o formulário com dados de exemplo
 */
function preencherExemplo() {
  document.getElementById('peso').value = DADOS_EXEMPLO.peso;
  document.getElementById('altura').value = DADOS_EXEMPLO.altura;
  document.getElementById('larguraAssento').value = DADOS_EXEMPLO.larguraAssento;
  document.getElementById('profundidade').value = DADOS_EXEMPLO.profundidade;
  document.getElementById('espessura').value = DADOS_EXEMPLO.espessura;
  document.getElementById('formato').value = DADOS_EXEMPLO.formato;
  document.getElementById('material').value = DADOS_EXEMPLO.material;
  document.getElementById('fatorSeguranca').value = DADOS_EXEMPLO.fatorSeguranca;
  
  // Auto-executar análise
  setTimeout(executarAnalise, 200);
}

/**
 * Limpa todos os campos do formulário
 */
function limparFormulario() {
  document.querySelector(SELETOR_FORMULARIO).reset();
  document.querySelector(SELETOR_RESULTADO).style.display = 'none';
  document.getElementById('secaoRelatorio').style.display = 'none';
  const secaoDiagrama = document.querySelector(SELETOR_DIAGRAMA);
  if (secaoDiagrama) {
    secaoDiagrama.style.display = 'none';
  }
  ultimosResultados = null;
}

/**
 * Função principal de execução da análise
 * Valida, coleta dados, calcula e exibe resultados
 */
function executarAnalise() {
  // Validar formulário
  const validacao = validarFormulario();
  
  if (!validacao.valido) {
    exibirErros(validacao.erros);
    return;
  }

  // Limpar erros anteriores
  const containerErros = document.getElementById('containerErros');
  if (containerErros) {
    containerErros.remove();
  }

  try {
    // Coletar dados
    const dados = coletarDadosFormulario();

    // Executar análise
    const resultados = analisarCadeira(dados);

    // Exibir resultados
    exibirResultados(resultados);

  } catch (erro) {
    console.error('Erro durante análise:', erro);
    exibirErros([`Erro durante cálculo: ${erro.message}`]);
  }
}

/**
 * Inicializa a aplicação
 * Configura event listeners e elementos da interface
 */
function inicializarAplicacao() {
  // Botão calcular
  const btnCalcular = document.querySelector(SELETOR_BTN_CALCULAR);
  if (btnCalcular) {
    btnCalcular.addEventListener('click', function(e) {
      e.preventDefault();
      executarAnalise();
    });
  }

  // Botão limpar
  const btnLimpar = document.querySelector(SELETOR_BTN_LIMPAR);
  if (btnLimpar) {
    btnLimpar.addEventListener('click', function(e) {
      e.preventDefault();
      limparFormulario();
    });
  }

  // Botão exemplo
  const btnExemplo = document.querySelector(SELETOR_BTN_EXEMPLO);
  if (btnExemplo) {
    btnExemplo.addEventListener('click', function(e) {
      e.preventDefault();
      preencherExemplo();
    });
  }

  // INPUT FOCUS: permitir submissão com Enter
  const inputs = document.querySelectorAll(SELETOR_FORMULARIO + ' input, ' + SELETOR_FORMULARIO + ' select');
  inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && e.target.type !== 'submit') {
        e.preventDefault();
        executarAnalise();
      }
    });
  });

  console.log('✓ Aplicação inicializada com sucesso');

  // Preencher e executar o exemplo padrão automaticamente na primeira carga
  setTimeout(() => {
    try {
      preencherExemplo();
    } catch (e) {
      console.warn('Não foi possível preencher o exemplo automaticamente:', e);
    }
  }, 300);
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarAplicacao);
