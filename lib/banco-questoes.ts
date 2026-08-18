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
  {
    id: 'bq-67-empreendedorismo',
    titulo: 'Avaliação Diagnóstica — Empreendedorismo',
    modulo: 'Empreendedorismo',
    series: ['6º ano', '7º ano'],
    etapa: 'EF Anos Finais',
    questoes: [
      {
        id: 'q67-1', numero: 1,
        enunciado: 'O que é empreendedorismo?\n\nLeia o texto abaixo e responda às questões.\nO empreendedorismo está presente em diversas situações do dia a dia. Empreender significa ter iniciativa para criar soluções, desenvolver projetos e transformar ideias em ações que tragam benefícios para as pessoas e para a sociedade. Um empreendedor precisa ser criativo, responsável, determinado e capaz de trabalhar em equipe para alcançar seus objetivos.',
        opcoes: [
          { letra: 'A', texto: 'Apenas administrar grandes empresas.' },
          { letra: 'B', texto: 'Criar soluções e oportunidades por meio de ideias e iniciativas.' },
          { letra: 'C', texto: 'Trabalhar sem planejamento e organização.' },
          { letra: 'D', texto: 'Desenvolver atividades somente para obter lucro imediato.' },
        ],
        correta: 'B',
      },
      {
        id: 'q67-2', numero: 2,
        enunciado: 'Entre as características abaixo, qual é importante para um empreendedor?',
        opcoes: [
          { letra: 'A', texto: 'Falta de interesse em aprender.' },
          { letra: 'B', texto: 'Criatividade e determinação.' },
          { letra: 'C', texto: 'Medo constante de mudanças.' },
          { letra: 'D', texto: 'Desorganização nas tarefas.' },
        ],
        correta: 'B',
      },
      {
        id: 'q67-3', numero: 3,
        enunciado: 'Qual das situações abaixo representa um exemplo de empreendedorismo social?',
        opcoes: [
          { letra: 'A', texto: 'Criar um projeto para arrecadar alimentos para famílias carentes.' },
          { letra: 'B', texto: 'Comprar produtos apenas para uso pessoal.' },
          { letra: 'C', texto: 'Abrir um negócio sem planejamento.' },
          { letra: 'D', texto: 'Trabalhar sozinho sem ajudar outras pessoas.' },
        ],
        correta: 'A',
      },
      {
        id: 'q67-4', numero: 4,
        enunciado: 'Uma atitude importante para quem deseja empreender é:',
        opcoes: [
          { letra: 'A', texto: 'Ignorar os problemas ao redor.' },
          { letra: 'B', texto: 'Esperar que outras pessoas tomem decisões.' },
          { letra: 'C', texto: 'Buscar soluções criativas para as necessidades da comunidade.' },
          { letra: 'D', texto: 'Evitar trabalhar em grupo.' },
        ],
        correta: 'C',
      },
      {
        id: 'q67-5', numero: 5,
        enunciado: 'O empreendedor deve agir de forma responsável, por isso não é correto:',
        opcoes: [
          { letra: 'A', texto: 'Planejar ações para melhorar a comunidade.' },
          { letra: 'B', texto: 'Buscar soluções para problemas existentes.' },
          { letra: 'C', texto: 'Desenvolver ideias úteis para as pessoas.' },
          { letra: 'D', texto: 'Obter lucro sem se preocupar com os impactos sociais.' },
        ],
        correta: 'D',
      },
      {
        id: 'q67-6', numero: 6,
        enunciado: 'Uma pessoa que identifica uma necessidade na comunidade e cria uma solução para atendê-la está demonstrando:',
        opcoes: [
          { letra: 'A', texto: 'Falta de planejamento.' },
          { letra: 'B', texto: 'Atitude empreendedora.' },
          { letra: 'C', texto: 'Desinteresse social.' },
          { letra: 'D', texto: 'Dificuldade de liderança.' },
        ],
        correta: 'B',
      },
      {
        id: 'q67-7', numero: 7,
        enunciado: 'Qual das alternativas abaixo representa uma vantagem do planejamento em um negócio?',
        opcoes: [
          { letra: 'A', texto: 'Evitar organização das atividades.' },
          { letra: 'B', texto: 'Aumentar as chances de alcançar objetivos.' },
          { letra: 'C', texto: 'Eliminar totalmente os desafios.' },
          { letra: 'D', texto: 'Reduzir a participação dos clientes.' },
        ],
        correta: 'B',
      },
      {
        id: 'q67-8', numero: 8,
        enunciado: 'A inovação no empreendedorismo está relacionada à capacidade de:',
        opcoes: [
          { letra: 'A', texto: 'Repetir sempre as mesmas ideias.' },
          { letra: 'B', texto: 'Ignorar as mudanças do mercado.' },
          { letra: 'C', texto: 'Desenvolver novas soluções e melhorias.' },
          { letra: 'D', texto: 'Trabalhar sem criatividade.' },
        ],
        correta: 'C',
      },
      {
        id: 'q67-9', numero: 9,
        enunciado: 'Um empreendedor responsável deve:',
        opcoes: [
          { letra: 'A', texto: 'Agir sem considerar as consequências de suas ações.' },
          { letra: 'B', texto: 'Pensar apenas em benefícios financeiros.' },
          { letra: 'C', texto: 'Contribuir de forma positiva para a sociedade.' },
          { letra: 'D', texto: 'Evitar mudanças e novas experiências.' },
        ],
        correta: 'C',
      },
      {
        id: 'q67-10', numero: 10,
        enunciado: 'A cooperação entre os membros de uma equipe é importante porque:',
        opcoes: [
          { letra: 'A', texto: 'Dificulta a realização das tarefas.' },
          { letra: 'B', texto: 'Ajuda na troca de conhecimentos e ideias.' },
          { letra: 'C', texto: 'Reduz a comunicação entre as pessoas.' },
          { letra: 'D', texto: 'Impede a resolução de problemas.' },
        ],
        correta: 'B',
      },
      {
        id: 'q67-11', numero: 11,
        enunciado: 'A educação financeira é importante porque ajuda as pessoas a:',
        opcoes: [
          { letra: 'A', texto: 'Gastar dinheiro sem planejamento.' },
          { letra: 'B', texto: 'Organizar melhor seus gastos e economias.' },
          { letra: 'C', texto: 'Comprar produtos sem necessidade.' },
          { letra: 'D', texto: 'Evitar qualquer tipo de investimento.' },
        ],
        correta: 'B',
      },
      {
        id: 'q67-12', numero: 12,
        enunciado: 'Quando uma pessoa estabelece metas para alcançar seus objetivos profissionais, ela demonstra:',
        opcoes: [
          { letra: 'A', texto: 'Falta de responsabilidade.' },
          { letra: 'B', texto: 'Planejamento e organização.' },
          { letra: 'C', texto: 'Desinteresse pelo futuro.' },
          { letra: 'D', texto: 'Medo de assumir desafios.' },
        ],
        correta: 'B',
      },
      {
        id: 'q67-13', numero: 13,
        enunciado: 'O uso da tecnologia nos negócios pode contribuir para:',
        opcoes: [
          { letra: 'A', texto: 'Melhorar a comunicação e os serviços oferecidos.' },
          { letra: 'B', texto: 'Dificultar o atendimento ao cliente.' },
          { letra: 'C', texto: 'Reduzir a criatividade das empresas.' },
          { letra: 'D', texto: 'Impedir o crescimento profissional.' },
        ],
        correta: 'A',
      },
      {
        id: 'q67-14', numero: 14,
        enunciado: 'O respeito às diferenças dentro de uma equipe é importante porque:',
        opcoes: [
          { letra: 'A', texto: 'Fortalece a convivência e o trabalho coletivo.' },
          { letra: 'B', texto: 'Diminui a participação das pessoas.' },
          { letra: 'C', texto: 'Impede a troca de ideias.' },
          { letra: 'D', texto: 'Reduz a cooperação entre os membros.' },
        ],
        correta: 'A',
      },
      {
        id: 'q67-15', numero: 15,
        enunciado: 'Uma pessoa que busca aprender novas habilidades e conhecimentos demonstra:',
        opcoes: [
          { letra: 'A', texto: 'Interesse em crescer pessoal e profissionalmente.' },
          { letra: 'B', texto: 'Dificuldade em alcançar objetivos.' },
          { letra: 'C', texto: 'Falta de iniciativa para aprender.' },
          { letra: 'D', texto: 'Desorganização em suas atividades.' },
        ],
        correta: 'A',
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
