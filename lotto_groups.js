const gerarNumerosDe1a25 = () => Array.from({ length: 25 }, (_, i) => i + 1)

const sortear = (size, numeros) => {
  const sorteados = [];
  while (sorteados.length < size) {
    const index = Math.floor(Math.random() * numeros.length);
    sorteados.push(numeros.splice(index, 1)[0]);
  }
  return sorteados.sort((a, b) => a - b)
}

const sortear15Numeros = () => sortear(15,gerarNumerosDe1a25())

function criarJogosAleatorios() {
  const jogos = [];
  for (let i=0; i<10; i++) jogos.push(sortear15Numeros())
  console.log("10 jogos aleatorios:\n", jogos,"\n");
  return jogos
}

function criarGruposFixos() {
  const grupos = [];
  const numeros = gerarNumerosDe1a25();
  for (let i=0; i<5; i++) grupos[i] = sortear(5, numeros)
  console.log("Grupos de 5 numeros nao-repetidos:\n", grupos,"\n")
  return grupos
}

function combinarGruposEmJogos(grupos) {
  const jogos = [];
  for (let i = 0; i < grupos.length - 2; i++) {
    for (let j = i + 1; j < grupos.length - 1; j++) {
      for (let k = j + 1; k < grupos.length; k++) {
        const jogo = [...grupos[i], ...grupos[j], ...grupos[k]].sort((a, b) => a - b);
        jogos.push(jogo);
      }
    }
  }
  console.log("10 jogos formados pelos grupos:\n", jogos,"\n")
  return jogos
}

// function contarAcertosGrupos(grupos, sorteio) {
//   return grupos
//     .map(grupo => grupo.filter(num => sorteio.includes(num)).length)
//     .sort((a, b) => b - a)
//     .slice(0, 3)
//     .reduce((a, b) => a + b, 0)
// }

const contarAcertos = (jogos, sorteio) => jogos.map(jogo => jogo.filter(num => sorteio.includes(num)).length)

function simular(numSorteios = 100000) {
  const grupos = criarGruposFixos()
  const jogosGrupos = combinarGruposEmJogos(grupos)
  const jogosAleatorios = criarJogosAleatorios()
  const resultados = {grupos: {}, aleatorios: {}}

  for (let i=0; i<numSorteios; i++) {
    const sorteio = sortear15Numeros();

    // const acertosGrupos = contarAcertosGrupos(grupos, sorteio);
    // resultados.grupos[acertosGrupos] = (resultados.grupos[acertosGrupos] || 0) + 1;

    const acertosGrupos = contarAcertos(jogosGrupos, sorteio);
    acertosGrupos.forEach(acertos => {
      resultados.grupos[acertos] = (resultados.grupos[acertos] || 0) + 1;
    });

    const acertosAleatorios = contarAcertos(jogosAleatorios, sorteio);
    acertosAleatorios.forEach(acertos => {
      resultados.aleatorios[acertos] = (resultados.aleatorios[acertos] || 0) + 1;
    });
  }
  return resultados;
}

const percentage = (resultado, total) => ((resultado || 0) / total * 100)
const print = (e, d = 2, n = 10) =>  e.toFixed(d).padStart(n)

function mostrarEstatisticas(resultados, totalSorteios) {
  let gruposAcumulado = 0;
  let aleatoriosAcumulado = 0;

  console.log("\n Acertos |   Grupos (%)  | Aleatórios (%)");
  for (let i = 15; i >= 5; i--) {
    const g = percentage(resultados.grupos[i],totalSorteios * 10);
    const a = percentage(resultados.aleatorios[i],totalSorteios * 10);
    gruposAcumulado += g
    aleatoriosAcumulado += a

    console.log(`   ${print(i,0,3)}   |${print(g)}     |${print(a)}`);
  }
  console.log(`   Total |${print(gruposAcumulado)}     |${print(aleatoriosAcumulado)}`);

  console.log(`\nNumero de sorteios simulados: ${totalSorteios.toLocaleString("pt-BR")}`);
  console.log("------------------------");
  console.log("");
}

// Executar
const totalSimulacoes = 3268760*2;
const resultados = simular(totalSimulacoes,);
mostrarEstatisticas(resultados, totalSimulacoes);