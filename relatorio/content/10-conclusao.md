# Considerações finais

Este documento especificou o software de um sistema IoT para uma casa com
geração solar, cobrindo os seis itens pedidos na Parte A: o problema e os
usuários (Capítulo 2), o dicionário de dados (Capítulo 3), a arquitetura de
integração do sensor à aplicação (Capítulo 4), doze regras de negócio no
formato SE/ENTÃO (Capítulos 5 e 7), as telas (Capítulo 6) e a análise de
riscos e resiliência (Capítulo 7). O Capítulo 8 organizou a especificação como
plano de desenvolvimento, e o Capítulo 9 descreveu o protótipo.

Três decisões dão forma ao projeto. A primeira é que a segurança de vida não
depende do software: o sensor de gás tem alarme próprio, e o sistema
espalha o alarme pela casa, avisa e registra. A segunda é que tudo roda dentro de casa, de modo que a
falta de internet só afeta o acesso remoto e as notificações. A terceira é que
dados duvidosos nunca disparam ações: leituras reenviadas, atrasadas, nulas ou
de dispositivos offline ficam no histórico, mas não acionam relés.

O projeto percorre a cadeia de valor estudada na disciplina
[@ufjf2026cap5, p. 3]. A coleta combina leituras periódicas e eventos com
*heartbeat* (Unidade 2); a validação aplica na entrada as dimensões de
qualidade dos dados (Unidade 3); o armazenamento separa dados quentes, mornos
e frios (Unidade 4); e a integração usa *pub/sub*, *store-and-forward* e
regras SE/ENTÃO para entregar a informação certa à pessoa certa
(Unidade 5).

## Limitações

- **Custo estimado, não faturado.** O cálculo em reais orienta a família, mas
  não reproduz a conta: impostos, iluminação pública e as regras de
  compensação dos créditos [@brasil2022lei14300] variam com a distribuidora.
- **Limites ainda sem calibração.** Os tempos e limites das regras são
  valores iniciais razoáveis; precisam ser ajustados com dados reais da casa
  para evitar alertas demais ou de menos.
- **Um único *hub*.** O *hub* é um ponto único de falha. O nobreak, o
  reinício automático e a duração máxima dos comandos limitam o impacto, mas
  não o eliminam.
- **Sem dados reais.** A especificação e o protótipo usam dados simulados; a
  medição real precisa de calibração.

## Próximos passos

1. Implementar o protótipo funcional do Capítulo 9, ligando as telas
   do protótipo aos dados do middleware.
2. Instalar o sistema em uma casa e calibrar os limites com algumas semanas
   de dados.
3. Usar a previsão do tempo para planejar as cargas adiáveis do dia seguinte,
   em vez de reagir apenas à sobra do momento.
4. Avaliar a tarifa branca, em que o preço da energia muda com o horário, como
   mais um critério para as regras de cargas.
