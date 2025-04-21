import random
from collections import defaultdict

def gerar_numeros_de_1_a_25():
    return list(range(1, 26))

def sortear(size, numeros_originais):
    numeros = numeros_originais.copy()
    sorteados = []
    while len(sorteados) < size:
        index = random.randrange(len(numeros))
        sorteados.append(numeros.pop(index))
    return sorted(sorteados)

def sortear_15_numeros():
    return sortear(15, gerar_numeros_de_1_a_25())

def criar_jogos_aleatorios():
    jogos = [sortear_15_numeros() for _ in range(10)]
    print("10 jogos aleatórios:\n", jogos, "\n")
    return jogos

def criar_grupos_fixos():
    numeros = gerar_numeros_de_1_a_25()
    grupos = [sortear(5, numeros) for _ in range(5)]
    print("Grupos de 5 números não-repetidos:\n", grupos, "\n")
    return grupos

def combinar_grupos_em_jogos(grupos):
    jogos = []
    for i in range(len(grupos) - 2):
        for j in range(i + 1, len(grupos) - 1):
            for k in range(j + 1, len(grupos)):
                jogo = sorted(grupos[i] + grupos[j] + grupos[k])
                jogos.append(jogo)
    print("10 jogos formados pelos grupos:\n", jogos, "\n")
    return jogos

def contar_acertos(jogos, sorteio):
    return [len(set(jogo) & set(sorteio)) for jogo in jogos]

def simular(num_sorteios=100_000):
    grupos = criar_grupos_fixos()
    jogos_grupos = combinar_grupos_em_jogos(grupos)
    jogos_aleatorios = criar_jogos_aleatorios()
    resultados = {'grupos': defaultdict(int), 'aleatorios': defaultdict(int)}

    for _ in range(num_sorteios):
        sorteio = sortear_15_numeros()

        acertos_grupos = contar_acertos(jogos_grupos, sorteio)
        for acertos in acertos_grupos:
            resultados['grupos'][acertos] += 1

        acertos_aleatorios = contar_acertos(jogos_aleatorios, sorteio)
        for acertos in acertos_aleatorios:
            resultados['aleatorios'][acertos] += 1

    return resultados

def percentage(resultado, total):
    return (resultado / total * 100) if resultado else 0

def print_alinhado(valor, d=2, n=10):
    return f"{valor:.{d}f}".rjust(n)

def mostrar_estatisticas(resultados, total_sorteios):
    total_jogos = total_sorteios * 10
    grupos_acumulado = 0
    aleatorios_acumulado = 0

    print("\n Acertos |   Grupos (%)  | Aleatórios (%)")
    for i in range(15, 4, -1):
        g = percentage(resultados['grupos'].get(i, 0), total_jogos)
        a = percentage(resultados['aleatorios'].get(i, 0), total_jogos)
        grupos_acumulado += g
        aleatorios_acumulado += a
        print(f"   {str(i).rjust(3)}   |{print_alinhado(g)}     |{print_alinhado(a)}")

    print(f"   Total |{print_alinhado(grupos_acumulado)}     |{print_alinhado(aleatorios_acumulado)}")
    print(f"\nNúmero de sorteios simulados: {total_sorteios:,}".replace(",", "."))
    print("------------------------\n")

# Executar
if __name__ == "__main__":
    total_simulacoes = 3_268_760 * 2
    resultados = simular(total_simulacoes)
    mostrar_estatisticas(resultados, total_simulacoes)
