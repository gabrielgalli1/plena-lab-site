param([string]$PrivatePath, [string]$PhpPath = '')
$ErrorActionPreference = 'Stop'
if (!$PrivatePath) { throw 'Informe -PrivatePath com a pasta privada, fora da pasta pública e do repositório.' }
if (!$PhpPath) { $PhpPath = (Get-Command php -ErrorAction Stop).Source }
$taskPrivateRoot = (Resolve-Path -LiteralPath $PrivatePath).Path
$env:PLENA_REVENDA_PRIVATE = $taskPrivateRoot
$taskUsername = Read-Host 'Usuário compartilhado'
$taskSecret = Read-Host 'Senha exclusiva (mínimo de 14 caracteres)' -AsSecureString
$taskConfirmSecret = Read-Host 'Confirmar senha' -AsSecureString
$taskPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($taskSecret)
$taskConfirmPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($taskConfirmSecret)
try {
    $taskPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($taskPointer)
    $taskConfirmation = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($taskConfirmPointer)
    if ($taskPassword -cne $taskConfirmation) { throw 'A confirmação não confere.' }
    $taskPayload = @{username=$taskUsername; password=$taskPassword} | ConvertTo-Json -Compress
    $taskPayload | & $PhpPath (Join-Path $PSScriptRoot 'configurar-acesso.php')
    if ($LASTEXITCODE -ne 0) { throw 'A configuração não foi concluída. Revise as mensagens acima.' }
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($taskPointer)
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($taskConfirmPointer)
    Remove-Variable taskPassword,taskConfirmation,taskPayload -ErrorAction SilentlyContinue
    $taskSecret.Dispose(); $taskConfirmSecret.Dispose()
}
