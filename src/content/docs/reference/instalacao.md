---
title: Manual de Instalação e Uso – Smart Ruler Eletromidia
description: A reference page in my new Starlight docs site.
---

 

## Bem-vindo!

Bem-vindo ao guia de instalação e uso da sua **Smart Ruler**! Este manual rápido foi desenvolvido para garantir que você aproveite ao máximo sua régua elétrica inteligente, integrada à plataforma **IoT Hub da Eletromidia**. A Smart Ruler oferece controle independente local e remoto de quatro tomadas, gerenciadas por um ESP32, proporcionando eficiência e flexibilidade para o seu MUB Eletromidia.

## 1. Instalação da Smart Ruler no MUB Eletromidia

Siga os passos abaixo para uma instalação rápida e segura do seu dispositivo.

### 1.1. Localização Ideal para Instalação

A Smart Ruler foi projetada para ser instalada de forma estratégica no **chassi superior exposto** do MUB. Esta posição garante otimização de espaço e fácil acesso para futuras manutenções.

### 1.2. Fixação Segura do Dispositivo

1.  Utilize uma **chave de boca de 8mm (ou similar)** para apertar um **parafuso M5 sextavado**.
2.  A fixação deve ser feita utilizando a **barra de travamento metálica inclusa**, que assegurará a correta e firme aderência do dispositivo ao chassi.

### 1.3. Alimentação da Smart Ruler

1.  Conecte o **cabo de força tripolar** (não incluso) na entrada de alimentação da Smart Ruler.
2.  Antes de ligar, **verifique a integridade e o correto posicionamento do fusível de 10 Amperes.**
3.  A Smart Ruler possui **ajuste automático de tensão (110V/220V)**, eliminando a necessidade de seleção manual e garantindo compatibilidade com diferentes redes elétricas.

## 2. Conexões das Tomadas (De Cima para Baixo)

A régua possui quatro tomadas com funções específicas dentro do ecossistema do MUB:

| Tomada | Nome no Dispositivo | Equipamento Conectado | Função e Controle |
| :--- | :--- | :--- | :--- |
| **1ª (Topo)** | **ENTRADA DIRETA** | Tomada de Serviço | Energia **Constante** (Sem Controle Remoto) para uso de técnicos em campo. |
| **2ª** | **MODEM** | Modem do MUB | Conexão dedicada para o Modem. Controle Remoto e Local. |
| **3ª** | **PC** | PC NUC do MUB | Conexão dedicada para o PC NUC. Controle Remoto e Local. |
| **4ª (Base)** | **TOMADA 3** | Implementações Futuras | Reservada para novos dispositivos e expansão da plataforma IoT. Controle Remoto e Local. |

***

![Etapas de Instalação](/smartuler-etapas.png)


### Detalhamento das Conexões

* **Conexão do Modem:** Conecte o **modem do MUB** na **segunda tomada**, identificada com a legenda **"MODEM"**.
* **Conexão do PC:** Conecte o **PC NUC do MUB** na **terceira tomada**, claramente marcada com a legenda **"PC"**.
* **Tomada de Serviço "ENTRADA DIRETA":** A **primeira tomada** oferece energia **constante** e está disponível para uso por técnicos em campo para tarefas temporárias.
* **"TOMADA 3":** A **última tomada** é reservada para **novas implementações e dispositivos futuros** que serão integrados à plataforma IoT Hub da Eletromidia.

## 3. Funcionalidades da Smart Ruler

A Smart Ruler é o centro de controle inteligente do seu MUB, oferecendo:

* **Controle Independente:** Cada uma das quatro tomadas (exceto a "ENTRADA DIRETA") pode ser acionada e desativada de forma independente.
* **Acionamento Local:** Botões físicos no dispositivo permitem o controle direto das tomadas.
* **Acionamento Remoto:** Gerencie suas tomadas de qualquer lugar através da **plataforma IoT Hub da Eletromidia**, otimizando o consumo de energia e a operação dos seus equipamentos.
* **Monitoramento:** Acompanhe o status e o consumo das tomadas (se aplicável ao modelo) diretamente pela plataforma.

## 4. Dicas de Segurança e Manutenção

* Certifique-se sempre de que o cabo de força esteja em boas condições e que o **fusível esteja íntegro** para evitar sobrecargas.
* Em caso de dúvidas ou problemas, consulte o **suporte técnico da Eletromidia**.
* Evite expor o dispositivo a umidade excessiva ou temperaturas extremas.

Esperamos que este manual ajude na rápida e eficiente instalação da sua Smart Ruler. Para mais informações ou suporte, acesse nossa central de ajuda online ou entre em contato com nossa equipe.

***