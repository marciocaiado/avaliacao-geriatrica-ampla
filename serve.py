#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor HTTP simples para desenvolvimento
Uso: python serve.py [porta]
"""

import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("\n>> Servidor iniciado com sucesso!\n")
    print(f">> Acesse: http://localhost:{PORT}")
    print(f">> Ou:     http://127.0.0.1:{PORT}")
    print("\n>> Pressione Ctrl+C para parar o servidor\n")
    httpd.serve_forever()
