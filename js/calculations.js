/**
 * calculations.js
 * Funções matemáticas e físicas para análise estrutural da cadeira
 * Todos os cálculos seguem normas simplificadas adequadas para nível acadêmico
 */

// Constante de aceleração da gravidade (m/s²)
const GRAVIDADE = 9.81;

// Número de pernas da cadeira (assumido como fixo)
const NUM_PERNAS = 4;

/**
 * Calcula a força peso total em Newtons
 * Fórmula: F = m * g
 * @param {number} massaKg - Massa da pessoa em kg
 * @returns {number} Força total em Newtons
 */
function calcularForcaPeso(massaKg) {
  return massaKg * GRAVIDADE;
}

/**
 * Calcula a força total distribuída em uma única perna
 * Hipótese: distribuição uniforme entre 4 pernas
 * @param {number} forcaTotal - Força total em N
 * @returns {number} Força por perna em N
 */
function calcularForcaPorPerna(forcaTotal) {
  return forcaTotal / NUM_PERNAS;
}

/**
 * Calcula a área da seção transversal da perna
 * Para seção quadrada: A = lado²
 * Para seção circular: A = π * d² / 4
 * @param {string} formato - 'quadrada' ou 'circular'
 * @param {number} espessuraCm - Dimensão em cm (lado para quadrada, diâmetro para circular)
 * @returns {object} Objeto com área em m² e mm²
 */
function calcularAreaSecao(formato, espessuraCm) {
  // Converter cm para m
  const espessuraM = espessuraCm / 100;
  let areaM2;

  if (formato === 'quadrada') {
    // Seção quadrada: A = lado²
    areaM2 = espessuraM * espessuraM;
  } else if (formato === 'circular') {
    // Seção circular: A = π * d² / 4
    areaM2 = Math.PI * (espessuraM ** 2) / 4;
  }

  // Converter para mm²
  const areaMM2 = areaM2 * 1e6;

  return {
    areaM2: areaM2,
    areaMM2: areaMM2
  };
}

/**
 * Calcula a tensão normal de compressão
 * Fórmula: σ = F / A
 * @param {number} forcaPerna - Força atuando na perna em N
 * @param {number} areaM2 - Área da seção em m²
 * @returns {number} Tensão normal em MPa
 */
function calcularTensaoNormal(forcaPerna, areaM2) {
  // Tensão em N/m² (Pa)
  const tensaoPa = forcaPerna / areaM2;
  
  // Converter para MPa (1 MPa = 1e6 Pa)
  const tensaoMPa = tensaoPa / 1e6;
  
  return tensaoMPa;
}

/**
 * Calcula o momento fletor simplificado na perna
 * Aproximação didática: M = F * (L/2)
 * Onde L é a largura do assento atuando como braço de alavanca
 * @param {number} forcaPerna - Força por perna em N
 * @param {number} larguraAssentoM - Largura do assento em metros
 * @returns {number} Momento fletor em N·m
 */
function calcularMomentoFletor(forcaPerna, larguraAssentoM) {
  // Braço de alavanca simplificado: metade da largura do assento
  const braco = larguraAssentoM / 2;
  
  // M = F * braço
  const momentoNm = forcaPerna * braco;
  
  return momentoNm;
}

/**
 * Calcula o momento de inércia da seção transversal
 * Para seção quadrada: I = lado⁴ / 12
 * Para seção circular: I = π * d⁴ / 64
 * @param {string} formato - 'quadrada' ou 'circular'
 * @param {number} espessuraCm - Dimensão em cm (lado ou diâmetro)
 * @returns {number} Momento de inércia em m⁴
 */
function calcularMomentoInercia(formato, espessuraCm) {
  // Converter cm para m
  const espessuraM = espessuraCm / 100;
  let inerciaMT4;

  if (formato === 'quadrada') {
    // Para seção quadrada: I = lado⁴ / 12
    inerciaMT4 = (espessuraM ** 4) / 12;
  } else if (formato === 'circular') {
    // Para seção circular: I = π * d⁴ / 64
    inerciaMT4 = Math.PI * (espessuraM ** 4) / 64;
  }

  return inerciaMT4;
}

/**
 * Calcula a distância máxima da fibra extrema até o eixo neutro
 * Para seção quadrada: c = lado / 2
 * Para seção circular: c = d / 2
 * @param {string} formato - 'quadrada' ou 'circular'
 * @param {number} espessuraCm - Dimensão em cm (lado ou diâmetro)
 * @returns {number} Distância em m
 */
function calcularDistanciaFibraExtrema(formato, espessuraCm) {
  // Converter cm para m
  const espessuraM = espessuraCm / 100;
  
  // Para ambas as geometrias: c = dimensão / 2
  const distanciaM = espessuraM / 2;
  
  return distanciaM;
}

/**
 * Calcula a tensão de flexão na seção transversal
 * Fórmula: σ_flexão = (M * c) / I
 * @param {number} momentoNm - Momento fletor em N·m
 * @param {number} distanciaM - Distância até fibra extrema em m
 * @param {number} inerciaMT4 - Momento de inércia em m⁴
 * @returns {number} Tensão de flexão em MPa
 */
function calcularTensaoFlexao(momentoNm, distanciaM, inerciaMT4) {
  // Evitar divisão por zero
  if (inerciaMT4 === 0) {
    return 0;
  }

  // Tensão em N/m² (Pa)
  const tensaoPa = (momentoNm * distanciaM) / inerciaMT4;
  
  // Converter para MPa
  const tensaoMPa = tensaoPa / 1e6;
  
  return tensaoMPa;
}

/**
 * Calcula a tensão limite admissível considerando fator de segurança
 * Fórmula: σ_limite_efetivo = σ_admissível / fator_segurança
 * @param {number} tensaoAdmissivelMPa - Tensão admissível do material em MPa
 * @param {number} fatorSeguranca - Fator de segurança aplicado
 * @returns {number} Tensão limite efetiva em MPa
 */
function calcularTensaoLimiteEfetiva(tensaoAdmissivelMPa, fatorSeguranca) {
  return tensaoAdmissivelMPa / fatorSeguranca;
}

/**
 * Verifica se a tensão calculada está dentro do limite admissível
 * @param {number} tensaoCalculada - Tensão calculada em MPa
 * @param {number} tensaoLimite - Tensão limite em MPa
 * @returns {boolean} true se seguro, false se inseguro
 */
function verificarSeguranca(tensaoCalculada, tensaoLimite) {
  return tensaoCalculada <= tensaoLimite;
}

/**
 * Função principal de análise completa da cadeira
 * Integra todos os cálculos em um objeto de resultados
 * @param {object} dados - Objeto com os parâmetros de entrada
 * @returns {object} Objeto com todos os resultados calculados
 */
function analisarCadeira(dados) {
  // Extrair dados de entrada
  const {
    peso,           // kg
    altura,         // cm
    larguraAssento, // cm
    profundeAssento, // cm (não usado neste modelo simplificado)
    espessuraPerna, // cm
    formato,        // 'quadrada' ou 'circular'
    material,       // 'madeira', 'aco', 'aluminio'
    fatorSeguranca  // número (recomendado: 2 ou 3)
  } = dados;

  // Obter material
  const matProp = obterMaterial(material);

  // Passo 1: Calcular força total
  const forcaTotal = calcularForcaPeso(peso);

  // Passo 2: Força por perna
  const forcaPerna = calcularForcaPorPerna(forcaTotal);

  // Passo 3: Área da seção
  const area = calcularAreaSecao(formato, espessuraPerna);

  // Passo 4: Tensão normal de compressão
  const tensaoNormal = calcularTensaoNormal(forcaPerna, area.areaM2);

  // Passo 5: Momento fletor
  const larguraAssentoM = larguraAssento / 100;
  const momentoFletor = calcularMomentoFletor(forcaPerna, larguraAssentoM);

  // Passo 6: Momento de inércia
  const inercia = calcularMomentoInercia(formato, espessuraPerna);

  // Passo 7: Distância até fibra extrema
  const distanciaFibraExtrema = calcularDistanciaFibraExtrema(formato, espessuraPerna);

  // Passo 8: Tensão de flexão
  const tensaoFlexao = calcularTensaoFlexao(momentoFletor, distanciaFibraExtrema, inercia);

  // Passo 9: Calcular limites efetivos com fator de segurança
  const tensaoLimiteCompressao = calcularTensaoLimiteEfetiva(
    matProp.tensaoAdmissivelCompressao,
    fatorSeguranca
  );

  const tensaoLimiteFlexao = calcularTensaoLimiteEfetiva(
    matProp.tensaoAdmissivelFlexao,
    fatorSeguranca
  );

  // Passo 10: Verificação de segurança
  const seguroCompressao = verificarSeguranca(tensaoNormal, tensaoLimiteCompressao);
  const seguroFlexao = verificarSeguranca(tensaoFlexao, tensaoLimiteFlexao);
  const seguroGeral = seguroCompressao && seguroFlexao;

  // Montar objeto de resultados
  return {
    // Dados de entrada
    entrada: {
      peso: peso,
      altura: altura,
      larguraAssento: larguraAssento,
      profundidade: profundeAssento,
      espessura: espessuraPerna,
      formato: formato,
      material: material,
      fatorSeguranca: fatorSeguranca
    },

    // Resultados dos cálculos
    forcaTotal: forcaTotal,
    forcaPerna: forcaPerna,
    areaSecao: area,
    tensaoNormal: tensaoNormal,
    momentoFletor: momentoFletor,
    inercia: inercia,
    distanciaFibra: distanciaFibraExtrema,
    tensaoFlexao: tensaoFlexao,

    // Limites do material
    material: {
      nome: matProp.nome,
      tensaoAdmissivelCompressao: matProp.tensaoAdmissivelCompressao,
      tensaoAdmissivelFlexao: matProp.tensaoAdmissivelFlexao,
      tensaoLimiteCompressao: tensaoLimiteCompressao,
      tensaoLimiteFlexao: tensaoLimiteFlexao
    },

    // Verificações de segurança
    seguranca: {
      compressaoOK: seguroCompressao,
      flexaoOK: seguroFlexao,
      seguro: seguroGeral
    }
  };
}
