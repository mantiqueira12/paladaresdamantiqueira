# Gera o zip do dist/ para upload manual no Netlify.
# Usa caminhos com barra normal (/) - o Compress-Archive do Windows usa "\" e
# quebra o deploy no Netlify (Linux nao reconhece as pastas, pagina fica em branco).
#
# Uso:  npm run build   (gera o dist/)
#       powershell -ExecutionPolicy Bypass -File scripts/zip-dist.ps1
#
# Obs.: arquivo mantido em ASCII puro de proposito - assim o PowerShell 5.1
# faz o parse certo em qualquer codepage (acentos/travessao quebravam o build).

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sep  = [char]92
$root = Split-Path $PSScriptRoot -Parent
$dist = Join-Path $root 'dist'
$zip  = Join-Path (Split-Path $root -Parent) 'paladares-da-mantiqueira-site.zip'

if (-not (Test-Path $dist)) { Write-Error "dist/ nao existe - rode 'npm run build' antes."; exit 1 }

$fs = [System.IO.File]::Open($zip, [System.IO.FileMode]::Create)
$arch = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
$base = (Resolve-Path $dist).Path.TrimEnd($sep) + $sep
foreach ($f in Get-ChildItem $dist -Recurse -File) {
  $rel = $f.FullName.Substring($base.Length).Replace($sep, '/')
  $entry = $arch.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
  $es = $entry.Open()
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $es.Write($bytes, 0, $bytes.Length)
  $es.Dispose()
}
$arch.Dispose(); $fs.Close()
Write-Output ("ZIP gerado: {0} ({1} MB)" -f $zip, ([math]::Round((Get-Item $zip).Length/1MB, 1)))
