param([int]$Port = 4185, [string]$PrivatePath = '', [string]$PhpPath = '')
$ErrorActionPreference = 'Stop'
$taskProjectRoot = Split-Path $PSScriptRoot -Parent
$taskWorkspaceRoot = Split-Path (Split-Path $taskProjectRoot -Parent) -Parent
if (!$PrivatePath) { $PrivatePath = Join-Path $taskWorkspaceRoot 'work/revendedores/privado' }
if (!$PhpPath) {
    $taskPortablePhp = Join-Path $taskWorkspaceRoot 'work/php-runtime/php/php.exe'
    if (Test-Path -LiteralPath $taskPortablePhp) { $PhpPath = $taskPortablePhp }
    else { $PhpPath = (Get-Command php -ErrorAction Stop).Source }
}
$taskPrivateRoot = (Resolve-Path -LiteralPath $PrivatePath).Path
$taskPublicRoot = (Resolve-Path -LiteralPath (Join-Path $taskProjectRoot 'dist')).Path
if ($taskPrivateRoot.StartsWith($taskPublicRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase) -or $taskPrivateRoot -eq $taskPublicRoot) { throw 'O armazenamento comercial deve ficar fora da pasta pública.' }
$env:PLENA_LOCAL = '1'
$env:PLENA_REVENDA_PRIVATE = $taskPrivateRoot
Write-Host "Site local: http://127.0.0.1:$Port/"
& $PhpPath -d display_errors=0 -S "127.0.0.1:$Port" -t $taskPublicRoot (Join-Path $PSScriptRoot 'router-local.php')
