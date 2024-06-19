## Instruções de Instalação

1. **Verificar Instalação do Node.js**
   - Antes de prosseguir, é necessário verificar se o Node.js está instalado no seu sistema.
   - Abra o Prompt de Comando (pode fazer isso pressionando `Win + R`, digitando `cmd` e pressionando Enter).
   - No Prompt de Comando, digite o seguinte comando e pressione Enter:
     ```sh
     node -v
     ```
   - Se o Node.js estiver instalado, você verá a versão instalada. Caso contrário, siga as instruções abaixo para instalar o Node.js:

     **Para Instalar o Node.js:**
     - Acesse o site oficial do Node.js: [nodejs.org](https://nodejs.org/)
     - Baixe o instalador adequado para o seu sistema operacional (recomenda-se a versão LTS).
     - Execute o instalador e siga as instruções de instalação.
     - Após a instalação, reinicie o Prompt de Comando e verifique novamente a instalação digitando `node -v`.

2. **Abrir o Prompt de Comando na Pasta do Projeto**
   - Após baixar e extrair os arquivos, abra a pasta do projeto.
   - Clique na barra de endereço da pasta, apague o endereço atual, digite `cmd` e pressione Enter.
   - Isso abrirá o Prompt de Comando na pasta atual.

3. **Instalar Dependências**
   - No terminal que foi aberto, digite o seguinte comando e pressione Enter:
     ```sh
     npm install
     ```
   - Este comando instalará todas as dependências necessárias para o player. Certifique-se de estar conectado à internet, pois o npm precisará baixar os pacotes necessários.

4. **Iniciar o Servidor Local**
   - Procure pelo arquivo `player youtube.bat` na pasta e abra-o.
   - Este arquivo iniciará o servidor local.

### Atenção
- **Mantenha o Terminal Aberto**: É importante manter o Prompt de Comando aberto enquanto o servidor estiver em execução. Isso garantirá que o player funcione corretamente e permitirá que você visualize qualquer saída ou mensagem relevante. Quando não precisar mais do servidor, você pode fechar o terminal.

### Dicas

1. **Criar Atalho no Desktop**
   - Você pode criar um atalho do arquivo `.bat` no desktop para facilitar o acesso futuro.
   - Também é possível personalizar o ícone do atalho nas propriedades.

2. **Comandos de Teclado para Controlar o Player**
   - `s`: Ativa o modo aleatório.
   - `r`: Repete a mesma música em loop.
   - `m`: Muta o som.
   - `→`: Próxima música.
   - `←`: Música anterior.
   - `espaço`: Play/Pause.
