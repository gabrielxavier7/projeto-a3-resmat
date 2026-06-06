/**
 * report.js
 * Geração de relatório técnico em formato textual
 * Pronto para ser integrado em trabalhos acadêmicos
 */

/**
 * Formata um número para exibição com casas decimais
 * @param {number} valor - Valor a formatar
 * @param {number} casas - Número de casas decimais (padrão: 2)
 * @returns {string} Número formatado como string
 */
function formatarNumero(valor, casas = 2) {
  return parseFloat(valor).toFixed(casas);
}

/**
 * Formata a data e hora atual em formato brasileiro
 * @returns {string} Data e hora formatadas
 */
function obterDataatualFormatada() {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const ano = agora.getFullYear();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

/**
 * Gera o texto completo do relatório técnico
 * @param {object} resultados - Objeto retornado pela função analisarCadeira()
 * @returns {string} Relatório formatado em texto
 */
function gerarRelatorioTexto(resultados) {
  const entrada = resultados.entrada;
  const material = resultados.material;
  const seguranca = resultados.seguranca;

  let relatorio = '';

  relatorio += '╔════════════════════════════════════════════════════════════════╗\n';
  relatorio += '║       ANÁLISE ESTRUTURAL SIMPLIFICADA DE CADEIRA              ║\n';
  relatorio += '║          Disciplina: Resistência dos Materiais                ║\n';
  relatorio += '╚════════════════════════════════════════════════════════════════╝\n\n';

  relatorio += `Data de Emissão: ${obterDataatualFormatada()}\n\n`;

  // SEÇÃO 1: DADOS DE ENTRADA
  relatorio += '1. DADOS DE ENTRADA\n';
  relatorio += '─'.repeat(64) + '\n';
  relatorio += `   Peso da pessoa: ${formatarNumero(entrada.peso, 1)} kg\n`;
  relatorio += `   Altura da cadeira: ${formatarNumero(entrada.altura, 1)} cm\n`;
  relatorio += `   Largura do assento: ${formatarNumero(entrada.larguraAssento, 1)} cm\n`;
  relatorio += `   Profundidade do assento: ${formatarNumero(entrada.profundidade, 1)} cm\n`;
  relatorio += `   Espessura da perna: ${formatarNumero(entrada.espessura, 2)} cm\n`;
  relatorio += `   Formato da perna: ${entrada.formato === 'quadrada' ? 'Quadrada' : 'Circular'}\n`;
  relatorio += `   Material: ${material.nome}\n`;
  relatorio += `   Fator de segurança aplicado: ${formatarNumero(entrada.fatorSeguranca, 1)}x\n\n`;

  // SEÇÃO 2: PROPRIEDADES DO MATERIAL
  relatorio += '2. PROPRIEDADES DO MATERIAL\n';
  relatorio += '─'.repeat(64) + '\n';
  relatorio += `   Material selecionado: ${material.nome}\n`;
  relatorio += `   Tensão admissível em compressão: ${formatarNumero(material.tensaoAdmissivelCompressao, 0)} MPa\n`;
  relatorio += `   Tensão admissível em flexão: ${formatarNumero(material.tensaoAdmissivelFlexao, 0)} MPa\n`;
  relatorio += `   Tensão limite efetiva (compressão): ${formatarNumero(material.tensaoLimiteCompressao, 2)} MPa\n`;
  relatorio += `   Tensão limite efetiva (flexão): ${formatarNumero(material.tensaoLimiteFlexao, 2)} MPa\n\n`;

  // SEÇÃO 3: CÁLCULOS REALIZADOS
  relatorio += '3. CÁLCULOS REALIZADOS\n';
  relatorio += '─'.repeat(64) + '\n';
  relatorio += `   Força total (peso): ${formatarNumero(resultados.forcaTotal, 2)} N\n`;
  relatorio += `   Força por perna (distribuição 4 pernas): ${formatarNumero(resultados.forcaPerna, 2)} N\n`;
  relatorio += `   Área da seção transversal: ${formatarNumero(resultados.areaSecao.areaMM2, 2)} mm²\n`;
  relatorio += `   Tensão normal de compressão: ${formatarNumero(resultados.tensaoNormal, 2)} MPa\n`;
  relatorio += `   Momento fletor simplificado: ${formatarNumero(resultados.momentoFletor, 4)} N·m\n`;
  relatorio += `   Momento de inércia: ${formatarNumero(resultados.inercia * 1e8, 4)} × 10⁻⁸ m⁴\n`;
  relatorio += `   Tensão de flexão: ${formatarNumero(resultados.tensaoFlexao, 2)} MPa\n\n`;

  // SEÇÃO 4: VERIFICAÇÃO DE SEGURANÇA
  relatorio += '4. VERIFICAÇÃO DE SEGURANÇA\n';
  relatorio += '─'.repeat(64) + '\n';

  // Verificação compressão
  const statusCompressao = seguranca.compressaoOK ? '✓ APROVADO' : '✗ REPROVADO';
  relatorio += `   Compressão: ${statusCompressao}\n`;
  relatorio += `      Tensão calculada: ${formatarNumero(resultados.tensaoNormal, 2)} MPa\n`;
  relatorio += `      Limite permitido: ${formatarNumero(material.tensaoLimiteCompressao, 2)} MPa\n`;
  if (seguranca.compressaoOK) {
    const margem = material.tensaoLimiteCompressao - resultados.tensaoNormal;
    relatorio += `      Margem de segurança: ${formatarNumero(margem, 2)} MPa (+${formatarNumero((margem / material.tensaoLimiteCompressao) * 100, 1)}%)\n`;
  } else {
    const excesso = resultados.tensaoNormal - material.tensaoLimiteCompressao;
    relatorio += `      Excedência: ${formatarNumero(excesso, 2)} MPa\n`;
  }

  // Verificação flexão
  const statusFlexao = seguranca.flexaoOK ? '✓ APROVADO' : '✗ REPROVADO';
  relatorio += `\n   Flexão: ${statusFlexao}\n`;
  relatorio += `      Tensão calculada: ${formatarNumero(resultados.tensaoFlexao, 2)} MPa\n`;
  relatorio += `      Limite permitido: ${formatarNumero(material.tensaoLimiteFlexao, 2)} MPa\n`;
  if (seguranca.flexaoOK) {
    const margem = material.tensaoLimiteFlexao - resultados.tensaoFlexao;
    relatorio += `      Margem de segurança: ${formatarNumero(margem, 2)} MPa (+${formatarNumero((margem / material.tensaoLimiteFlexao) * 100, 1)}%)\n`;
  } else {
    const excesso = resultados.tensaoFlexao - material.tensaoLimiteFlexao;
    relatorio += `      Excedência: ${formatarNumero(excesso, 2)} MPa\n`;
  }

  relatorio += '\n';

  // SEÇÃO 5: RESULTADO FINAL
  relatorio += '5. RESULTADO FINAL\n';
  relatorio += '─'.repeat(64) + '\n';
  
  if (seguranca.seguro) {
    relatorio += '   STATUS: ✓ CADEIRA SEGURA\n';
    relatorio += '\n   A cadeira suporta com segurança a carga aplicada (person de\n';
    relatorio += `   ${formatarNumero(entrada.peso, 0)} kg) considerando o fator de segurança de ${formatarNumero(entrada.fatorSeguranca, 1)}x.\n`;
    relatorio += '\n   Todas as verificações de resistência foram satisfeitas:\n';
    relatorio += '   • Tensão de compressão dentro dos limites\n';
    relatorio += '   • Tensão de flexão dentro dos limites\n';
  } else {
    relatorio += '   STATUS: ✗ CADEIRA NÃO SEGURA\n';
    relatorio += '\n   A cadeira NÃO suporta com segurança a carga aplicada.\n';
    
    if (!seguranca.compressaoOK) {
      relatorio += '   ✗ Falha em compressão: tensão excede o limite admissível\n';
      relatorio += `      Recomendação: aumentar espessura da perna ou trocar material\n`;
    }
    
    if (!seguranca.flexaoOK) {
      relatorio += '   ✗ Falha em flexão: tensão excede o limite admissível\n';
      relatorio += `      Recomendação: aumentar espessura da perna ou trocar material\n`;
    }
  }

  relatorio += '\n';

  // SEÇÃO 6: SUGESTÕES E OBSERVAÇÕES
  relatorio += '6. OBSERVAÇÕES E RECOMENDAÇÕES\n';
  relatorio += '─'.repeat(64) + '\n';
  relatorio += '   • Este software utiliza análise estrutural SIMPLIFICADA\n';
  relatorio += '   • O modelo assume distribuição uniforme em 4 pernas\n';
  relatorio += '   • Não considera efeitos dinâmicos ou impactos\n';
  relatorio += '   • Os valores de tensão admissível são aproximados\n';
  relatorio += '   • Recomenda-se validação com análises mais rigorosas\n';
  relatorio += '   • Fator de segurança mínimo recomendado: 2.0x\n';
  
  if (!seguranca.seguro) {
    relatorio += '\n   AÇÕES RECOMENDADAS:\n';
    if (!seguranca.compressaoOK || !seguranca.flexaoOK) {
      relatorio += '   1. Aumentar a espessura das pernas\n';
      relatorio += '   2. Mudar o material para um mais resistente (ex: aço)\n';
      relatorio += '   3. Reduzir o fator de segurança (não recomendado)\n';
    }
  }

  relatorio += '\n' + '═'.repeat(64) + '\n';
  relatorio += 'Fim do Relatório\n';
  relatorio += '═'.repeat(64) + '\n';

  return relatorio;
}

/**
 * Gera um resumo curto dos resultados para exibição na interface
 * @param {object} resultados - Objeto retornado pela função analisarCadeira()
 * @returns {object} Objeto com mensagens de diagnóstico
 */
function gerarDiagnostico(resultados) {
  const mensagens = {
    compressao: '',
    flexao: '',
    recomendacoes: []
  };

  // Análise de compressão
  if (resultados.seguranca.compressaoOK) {
    const margem = resultados.material.tensaoLimiteCompressao - resultados.tensaoNormal;
    mensagens.compressao = `✓ Compressão OK: ${formatarNumero(margem, 2)} MPa de margem`;
  } else {
    const excesso = resultados.tensaoNormal - resultados.material.tensaoLimiteCompressao;
    mensagens.compressao = `✗ Compressão CRÍTICA: ultrapassa em ${formatarNumero(excesso, 2)} MPa`;
    mensagens.recomendacoes.push('Aumentar espessura da perna');
  }

  // Análise de flexão
  if (resultados.seguranca.flexaoOK) {
    const margem = resultados.material.tensaoLimiteFlexao - resultados.tensaoFlexao;
    mensagens.flexao = `✓ Flexão OK: ${formatarNumero(margem, 2)} MPa de margem`;
  } else {
    const excesso = resultados.tensaoFlexao - resultados.material.tensaoLimiteFlexao;
    mensagens.flexao = `✗ Flexão CRÍTICA: ultrapassa em ${formatarNumero(excesso, 2)} MPa`;
    if (!mensagens.recomendacoes.includes('Aumentar espessura da perna')) {
      mensagens.recomendacoes.push('Aumentar espessura da perna');
    }
  }

  // Recomendações gerais
  if (!resultados.seguranca.compressaoOK || !resultados.seguranca.flexaoOK) {
    mensagens.recomendacoes.push('Usar material mais resistente (ex: aço)');
    mensagens.recomendacoes.push('Revisar fator de segurança aplicado');
  }

  return mensagens;
}
