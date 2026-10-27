# Migração para o computador novo

Snapshot de 27/10/2026 da pasta `NM-Brand-Guide`.

1. Instale Git, Git LFS e Python 3.
2. Entre na conta `mariaorfanelli-nm` no GitHub (por exemplo, `gh auth login`).
3. Clone este repositório e execute `git lfs pull`.
4. Para restaurar todos os projetos com a estrutura original, execute:

```bash
python3 .migration/restore-all-projects.py ~/Coding
```

As pastas de dependências, caches, configurações locais e credenciais não foram enviadas. Reinstale as dependências pelos arquivos de lock e de requisitos de cada projeto; transfira os arquivos `.env` por um meio privado. Os arquivos de mídia acima de 10 MiB são armazenados com Git LFS.

O inventário está em `.migration/snapshot.json`. Os arquivos que ficavam ao lado da pasta interna estão em `.migration/workspace-parent/`; o script os recoloca no local original.
