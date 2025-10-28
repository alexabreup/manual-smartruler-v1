# Instruções para o Modelo 3D

Para que o visualizador 3D funcione corretamente, você precisa:

1. **Copiar o arquivo GLB**: Coloque o arquivo `smart4-tomadas-verm.glb` neste diretório (`public/`)

2. **Estrutura esperada**:
   ```
   public/
   ├── smart4-tomadas-verm.glb  ← Arquivo do modelo 3D
   ├── favicon.svg
   └── smartuler-etapas-2.png
   ```

3. **Comando para copiar** (execute na raiz do projeto):
   ```bash
   cp /caminho/para/smart4-tomadas-verm.glb public/
   ```

## Verificação

Após copiar o arquivo, o modelo 3D será carregado automaticamente na página `/reference/modelo3d`.

Se o arquivo não for encontrado, será exibido um modelo de fallback simples para demonstração.

## Formatos Suportados

- **.glb** (recomendado) - Formato binário do glTF
- **.gltf** - Formato JSON do glTF (requer arquivos adicionais)

## Otimização

Para melhor performance:
- Mantenha o arquivo GLB com menos de 10MB
- Use texturas comprimidas quando possível
- Otimize a geometria para web