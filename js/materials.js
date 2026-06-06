/**
 * materials.js
 * Base de dados com propriedades mecânicas dos materiais
 * Valores simplificados e adequados para fins didáticos
 */

// Definição dos materiais e suas propriedades
const MATERIAIS = {
  madeira: {
    nome: 'Madeira',
    tensaoAdmissivelCompressao: 20,        // MPa
    tensaoAdmissivelFlexao: 15,            // MPa
    moduloElasticidade: 11000,             // MPa
    densidade: 0.6                         // g/cm³ (aproximado para softwood)
  },
  aco: {
    nome: 'Aço',
    tensaoAdmissivelCompressao: 250,       // MPa
    tensaoAdmissivelFlexao: 200,           // MPa
    moduloElasticidade: 200000,            // MPa
    densidade: 7.85                        // g/cm³
  },
  aluminio: {
    nome: 'Alumínio',
    tensaoAdmissivelCompressao: 150,       // MPa
    tensaoAdmissivelFlexao: 100,           // MPa
    moduloElasticidade: 69000,             // MPa
    densidade: 2.70                        // g/cm³
  }
};

/**
 * Obtém as propriedades de um material específico
 * @param {string} nomeMaterial - Chave do material (madeira, aco, aluminio)
 * @returns {object} Objeto com propriedades do material
 */
function obterMaterial(nomeMaterial) {
  return MATERIAIS[nomeMaterial] || MATERIAIS.madeira;
}

/**
 * Retorna lista com os nomes dos materiais disponíveis
 * @returns {array} Array com as chaves dos materiais
 */
function listarMateriais() {
  return Object.keys(MATERIAIS);
}
