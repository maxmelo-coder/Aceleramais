export interface Questao {
  id: string;
  numero: number;
  enunciado: string;
  opcoes: { letra: string; texto: string }[];
  correta: string;
}

export interface BancoQuestoes {
  id: string;
  titulo: string;
  modulo: string;
  series: string[];
  etapa: string;
  questoes: Questao[];
}

export const BANCO_QUESTOES: BancoQuestoes[] = [
  {
    id: 'bq-89-negocios',
    titulo: 'Avaliação Diagnóstica — Módulo Negócios',
    modulo: 'Negócios',
    series: ['8º ano', '9º ano'],
    etapa: 'EF Anos Finais',
    questoes: [
      {
        id: 'q1', numero: 1,
        enunciado: 'Mariana abriu uma cafeteria especializada em cafés gourmet em uma região onde a maioria das pessoas prefere bebidas tradicionais e de baixo custo. Após alguns meses, percebeu poucas vendas. Qual foi o principal problema enfrentado por Mariana?',
        opcoes: [
          { letra: 'A', texto: 'Falta de funcionários qualificados' },
          { letra: 'B', texto: 'Não analisar corretamente o perfil do público-alvo' },
          { letra: 'C', texto: 'Excesso de divulgação nas redes sociais' },
          { letra: 'D', texto: 'Investir em produtos de qualidade elevada' },
        ],
        correta: 'B',
      },
      {
        id: 'q2', numero: 2,
        enunciado: 'Antes de lançar um novo aplicativo de delivery, uma empresa resolveu disponibilizar uma versão simples para um pequeno grupo de usuários, a fim de testar a aceitação do produto. Essa estratégia representa:',
        opcoes: [
          { letra: 'A', texto: 'Produção em massa' },
          { letra: 'B', texto: 'Análise financeira' },
          { letra: 'C', texto: 'Aplicação do MVP' },
          { letra: 'D', texto: 'Definição de parceiros comerciais' },
        ],
        correta: 'C',
      },
      {
        id: 'q3', numero: 3,
        enunciado: 'No modelo Business Canvas, o bloco responsável por identificar para quem a empresa irá vender seus produtos e serviços é:',
        opcoes: [
          { letra: 'A', texto: 'Canais' },
          { letra: 'B', texto: 'Atividades-chave' },
          { letra: 'C', texto: 'Segmento de clientes' },
          { letra: 'D', texto: 'Estrutura de custos' },
        ],
        correta: 'C',
      },
      {
        id: 'q4', numero: 4,
        enunciado: 'Uma empresa deseja conhecer todos os gastos necessários para manter suas operações funcionando corretamente. Para isso, ela deve analisar principalmente:',
        opcoes: [
          { letra: 'A', texto: 'Estrutura de custos' },
          { letra: 'B', texto: 'Proposta de valor' },
          { letra: 'C', texto: 'Relacionamento com clientes' },
          { letra: 'D', texto: 'Fontes de receita' },
        ],
        correta: 'A',
      },
      {
        id: 'q5', numero: 5,
        enunciado: 'O Golden Circle é utilizado para ajudar empresas a definirem seu propósito e identidade. Entre as perguntas abaixo, qual faz parte desse modelo?',
        opcoes: [
          { letra: 'A', texto: 'Onde?' },
          { letra: 'B', texto: 'Quem?' },
          { letra: 'C', texto: 'Como?' },
          { letra: 'D', texto: 'Quanto?' },
        ],
        correta: 'C',
      },
      {
        id: 'q6', numero: 6,
        enunciado: 'Pedro percebeu que muitos moradores de seu bairro tinham dificuldade para encontrar produtos artesanais da região. Então, criou uma feira comunitária para valorizar os pequenos produtores locais. Essa atitude demonstra que o empreendedorismo:',
        opcoes: [
          { letra: 'A', texto: 'Está relacionado apenas ao comércio internacional' },
          { letra: 'B', texto: 'Busca identificar oportunidades e solucionar problemas da comunidade' },
          { letra: 'C', texto: 'É uma atividade voltada somente para pessoas com muito dinheiro' },
          { letra: 'D', texto: 'Não possui relação com inovação social' },
        ],
        correta: 'B',
      },
      {
        id: 'q7', numero: 7,
        enunciado: 'Durante a criação de um pequeno negócio, Ana organizou os custos, definiu metas e pesquisou possíveis clientes antes de iniciar as vendas. Essa etapa é conhecida como:',
        opcoes: [
          { letra: 'A', texto: 'Avaliação' },
          { letra: 'B', texto: 'Planejamento' },
          { letra: 'C', texto: 'Execução' },
          { letra: 'D', texto: 'Divulgação' },
        ],
        correta: 'B',
      },
      {
        id: 'q8', numero: 8,
        enunciado: 'João deseja abrir uma lanchonete próxima à escola de sua cidade. Antes disso, ele resolveu analisar quais alimentos os estudantes mais gostam de consumir. Essa atitude representa:',
        opcoes: [
          { letra: 'A', texto: 'Desperdício de tempo' },
          { letra: 'B', texto: 'Falta de organização' },
          { letra: 'C', texto: 'Análise do público-alvo' },
          { letra: 'D', texto: 'Ação imediata do produto' },
        ],
        correta: 'C',
      },
      {
        id: 'q9', numero: 9,
        enunciado: 'Sobre as características de um empreendedor, marque a alternativa correta:',
        opcoes: [
          { letra: 'A', texto: 'Evita mudanças e desafios' },
          { letra: 'B', texto: 'Depende sempre de outras pessoas para tomar decisões' },
          { letra: 'C', texto: 'Apresenta criatividade e iniciativa para resolver problemas' },
          { letra: 'D', texto: 'Trabalha apenas visando lucro imediato' },
        ],
        correta: 'C',
      },
      {
        id: 'q10', numero: 10,
        enunciado: 'Carla comprou um material escolar no valor de R$200,00, mas atrasou o pagamento em um mês. A loja cobra multa de 2% e juros de 1% ao mês. Qual será o valor total pago por Carla?',
        opcoes: [
          { letra: 'A', texto: 'R$202,00' },
          { letra: 'B', texto: 'R$204,00' },
          { letra: 'C', texto: 'R$206,00' },
          { letra: 'D', texto: 'R$210,00' },
        ],
        correta: 'C',
      },
      {
        id: 'q11', numero: 11,
        enunciado: 'Uma jovem criou uma página nas redes sociais para divulgar pequenos comerciantes de sua cidade e ajudar no aumento das vendas locais. Essa iniciativa demonstra:',
        opcoes: [
          { letra: 'A', texto: 'Acomodação diante dos problemas da comunidade' },
          { letra: 'B', texto: 'Espírito empreendedor voltado para colaboração e inovação' },
          { letra: 'C', texto: 'Falta de interesse pelo desenvolvimento social' },
          { letra: 'D', texto: 'Preocupação apenas com ganhos pessoais' },
        ],
        correta: 'B',
      },
      {
        id: 'q12', numero: 12,
        enunciado: 'Antes de lançar um novo produto, uma empresa realizou testes com um pequeno grupo de consumidores para verificar a aceitação no mercado. Essa prática é importante porque permite:',
        opcoes: [
          { letra: 'A', texto: 'Eliminar completamente os riscos do negócio' },
          { letra: 'B', texto: 'Conhecer possíveis melhorias antes do lançamento oficial' },
          { letra: 'C', texto: 'Aumentar imediatamente os lucros da empresa' },
          { letra: 'D', texto: 'Evitar qualquer tipo de planejamento' },
        ],
        correta: 'B',
      },
      {
        id: 'q13', numero: 13,
        enunciado: 'Em uma empresa, o setor responsável por divulgar produtos e atrair clientes utiliza estratégias de:',
        opcoes: [
          { letra: 'A', texto: 'Logística' },
          { letra: 'B', texto: 'Marketing' },
          { letra: 'C', texto: 'Produção' },
          { letra: 'D', texto: 'Armazenamento' },
        ],
        correta: 'B',
      },
      {
        id: 'q14', numero: 14,
        enunciado: 'Uma das atitudes mais importantes para quem deseja empreender é:',
        opcoes: [
          { letra: 'A', texto: 'Desistir facilmente diante das dificuldades' },
          { letra: 'B', texto: 'Esperar que outras pessoas resolvam os problemas' },
          { letra: 'C', texto: 'Buscar oportunidades e agir com iniciativa' },
          { letra: 'D', texto: 'Evitar mudanças no ambiente de trabalho' },
        ],
        correta: 'C',
      },
      {
        id: 'q15', numero: 15,
        enunciado: 'Uma bicicleta custava R$500,00 e recebeu um desconto de 10% durante uma promoção. Qual foi o valor do desconto recebido?',
        opcoes: [
          { letra: 'A', texto: 'R$25,00' },
          { letra: 'B', texto: 'R$40,00' },
          { letra: 'C', texto: 'R$50,00' },
          { letra: 'D', texto: 'R$75,00' },
        ],
        correta: 'C',
      },
    ],
  },
];

export function getBancoQuestoesBySerie(serie: string): BancoQuestoes | undefined {
  return BANCO_QUESTOES.find(bq => bq.series.includes(serie));
}

export function getBancoQuestoesById(id: string): BancoQuestoes | undefined {
  return BANCO_QUESTOES.find(bq => bq.id === id);
}
