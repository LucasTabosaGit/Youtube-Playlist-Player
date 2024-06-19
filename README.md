## Instruções de Instalação

1. **Abrir o Prompt de Comando na Pasta do Projeto**
   - Após baixar e extrair os arquivos, abra a pasta do projeto.
   - Clique na barra de endereço da pasta, apague o endereço atual, digite `cmd` e pressione Enter.
   - Isso abrirá o Prompt de Comando na pasta atual.

2. **Instalar Dependências**
   - No terminal que foi aberto, digite o seguinte comando e pressione Enter:
     ```sh
     npm install
     ```
   - Este comando instalará todas as dependências necessárias para o player. Certifique-se de estar conectado à internet, pois o npm precisará baixar os pacotes necessários.

3. **Iniciar o Servidor Local**
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
