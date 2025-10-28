#!/bin/bash

# Script para copiar o modelo 3D do projeto de referência

echo "Copiando modelo 3D..."

# Caminho do arquivo de origem
ORIGEM="/home/alxp/Documents/alxp/elt/smartruler-3d-manual/public/smart4-tomadas-verm.glb"

# Caminho de destino
DESTINO="public/smart4-tomadas-verm.glb"

# Verificar se o arquivo de origem existe
if [ -f "$ORIGEM" ]; then
    cp "$ORIGEM" "$DESTINO"
    echo "✅ Arquivo copiado com sucesso para: $DESTINO"
    echo "📁 Tamanho do arquivo: $(du -h "$DESTINO" | cut -f1)"
else
    echo "❌ Arquivo não encontrado em: $ORIGEM"
    echo "📋 Verifique se o caminho está correto ou se o arquivo existe."
fi

echo ""
echo "🚀 Para testar:"
echo "   npm run dev"
echo "   Acesse: http://localhost:4321/reference/modelo3d"