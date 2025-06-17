const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Verificando retorno de uma pergunta específica', () => {
  const enunciado = 'Qual é a capital do Brasil?';
  const perguntaId = modelo.cadastrar_pergunta(enunciado);
  const resultado = modelo.get_pergunta(perguntaId);

  expect(resultado.id_pergunta).toBe(perguntaId);
  expect(resultado.texto).toBe(enunciado);
  expect(resultado.id_usuario).toBe(1);
});

test('Validando criação de respostas e consulta das mesmas', () => {
  const perguntaId = modelo.cadastrar_pergunta('Qual framework de testes é mais utilizado no JS?');

  modelo.cadastrar_resposta(perguntaId, 'Jest');
  modelo.cadastrar_resposta(perguntaId, 'Mocha');

  const listaDeRespostas = modelo.get_respostas(perguntaId);

  expect(listaDeRespostas.length).toBe(2);
  expect(listaDeRespostas[0].texto).toBe('Jest');
  expect(listaDeRespostas[1].texto).toBe('Mocha');
  expect(listaDeRespostas[0].id_pergunta).toBe(perguntaId);
});

test('Checando quantidade de respostas por pergunta', () => {
  const perguntaComRespostas = modelo.cadastrar_pergunta('Exemplo de pergunta com respostas');
  const perguntaSemRespostas = modelo.cadastrar_pergunta('Exemplo de pergunta sem respostas');

  modelo.cadastrar_resposta(perguntaComRespostas, 'Primeira resposta');
  modelo.cadastrar_resposta(perguntaComRespostas, 'Segunda resposta');

  const totalRespostas1 = modelo.get_num_respostas(perguntaComRespostas);
  const totalRespostas2 = modelo.get_num_respostas(perguntaSemRespostas);

  expect(totalRespostas1).toBe(2);
  expect(totalRespostas2).toBe(0);
});

test('Testando listagem de perguntas e número de respostas', () => {
  const pId1 = modelo.cadastrar_pergunta('Cor do céu?');
  const pId2 = modelo.cadastrar_pergunta('Cor da vegetação?');
  const pId3 = modelo.cadastrar_pergunta('Cor do astro solar?');

  modelo.cadastrar_resposta(pId1, 'Azul');
  modelo.cadastrar_resposta(pId1, 'Cinza em dias nublados');
  modelo.cadastrar_resposta(pId3, 'Amarelo');

  const todasPerguntas = modelo.listar_perguntas();

  const pergunta1 = todasPerguntas.find(p => p.id_pergunta === pId1);
  const pergunta2 = todasPerguntas.find(p => p.id_pergunta === pId2);
  const pergunta3 = todasPerguntas.find(p => p.id_pergunta === pId3);

  expect(pergunta1.num_respostas).toBe(2);
  expect(pergunta2.num_respostas).toBe(0);
  expect(pergunta3.num_respostas).toBe(1);
});

