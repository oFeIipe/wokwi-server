# 🛡️ SAFEWAY — Servidor

> Servidor Node.js responsável pelo processamento de coordenadas GPS, geofencing e comunicação com o dispositivo ESP32 do projeto SAFEWAY.

---

## 📋 Sobre

O SAFEWAY é um dispositivo de segurança portátil para crianças que se locomovem sozinhas até a escola. Este repositório contém o **servidor backend**, que atua como ponte entre o microcontrolador ESP32 e o front-end de visualização.

O firmware do ESP32 está em: [oFeIipe/wokwi-simulator](https://github.com/oFeIipe/wokwi-simulator)

---

## ⚙️ Como funciona

O ESP32 envia coordenadas de latitude e longitude serializadas em JSON via **Socket TCP**. O servidor recebe esses dados, verifica se o ponto está dentro de uma área segura pré-definida usando a biblioteca **turf.js**, e responde ao dispositivo com `ATIVAR_SAFEWAY` caso a criança esteja fora da área segura.

```
ESP32 ──(Socket TCP)──► Servidor Node.js
                              │
                    turf.booleanPointInPolygon()
                              │
              ┌───────────────┴───────────────┐
         Dentro da área              Fora da área
         (sem resposta)        socket.write("ATIVAR_SAFEWAY")
                                      │
                               ESP32 aciona alarme
                               + envia mensagem Telegram
```

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js instalado
- Instâncias do servidor e do simulador na mesma rede

### Instalação

```bash
git clone https://github.com/oFeIipe/wokwi-server.git
cd wokwi-server
npm install
node server.js
```

O servidor sobe na porta `8081` aguardando conexões TCP do ESP32.

---

## 🗺️ Geofencing

A área segura é definida como um polígono de coordenadas usando **turf.js**:

```javascript
const safeway = turf.polygon([[
    [-47.78820991516114, -21.20785381859451],
    [-47.78819650411606, -21.208458951501076],
    // ...
]]);

const verificaPonto = (point) => turf.booleanPointInPolygon(point, safeway);
```

Quando o ponto recebido está **fora** do polígono, o servidor envia o comando de ativação de volta ao ESP32 via Socket TCP.

---

## 🗺️ Visualização

O servidor também serve um front-end com **Leaflet.js** para visualização em tempo real da posição do dispositivo no mapa, mostrando a área segura delimitada e a última posição recebida.

---

## 🛠️ Tecnologias

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

**Bibliotecas:** `turf.js` · `leaflet` · `express` · `net` (Socket TCP nativo do Node.js)

---

## 🔗 Repositórios do projeto

| Repositório | Descrição |
|---|---|
| [wokwi-server](https://github.com/oFeIipe/wokwi-server) | Este repositório — servidor Node.js |
| [wokwi-simulator](https://github.com/oFeIipe/wokwi-simulator) | Firmware do ESP32 simulado no Wokwi |

---

## 👥 Equipe

Projeto extensionista desenvolvido por alunos do curso de Ciência da Computação — Centro Universitário Estácio de Ribeirão Preto.

| Membro | Contribuição |
|---|---|
| Cristian Alves de Sousa | Protótipo Wokwi · API Telegram · Relatório |
| Diogo Onofre Junior | Identidade visual · Formulário · Entrevista |
| Felipe Costa de Carvalho | Protótipo Wokwi · API Telegram · Rastreamento GPS |
| Vinicius de Paulo Costa | Rastreamento GPS · Formulário · Entrevista |

---

<div align="center">
  <sub>Projeto SAFEWAY — Segurança a caminho da escola · Estácio Ribeirão Preto · 2025</sub>
</div>
