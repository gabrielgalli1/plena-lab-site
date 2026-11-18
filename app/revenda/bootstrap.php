<?php
declare(strict_types=1);

// Este diretório e os dados privados ficam FORA da raiz pública.
ini_set('display_errors', '0');
header('Cache-Control: no-store, private, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('Referrer-Policy: same-origin');
header('X-Frame-Options: SAMEORIGIN');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; base-uri 'none'");

function rv_escape(string $text): string { return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function rv_abort(int $status, string $message): never {
    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    exit($message);
}
function rv_local(): bool {
    return PHP_SAPI === 'cli-server' && getenv('PLENA_LOCAL') === '1'
        && in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true);
}
function rv_https(): bool { return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['SERVER_PORT'] ?? '') === '443'; }

if (!rv_local() && !rv_https()) rv_abort(503, 'Utilize uma conexão HTTPS para acessar a área de revendedores.');
$privatePath = getenv('PLENA_REVENDA_PRIVATE');
if (!$privatePath && is_file(__DIR__ . '/ambiente.php')) $privatePath = require __DIR__ . '/ambiente.php';
$privateRoot = is_string($privatePath) ? realpath($privatePath) : false;
$publicRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
if (!$privateRoot || !$publicRoot) rv_abort(503, 'A área de revendedores está temporariamente indisponível. Entre em contato com a Plena-Lab.');
$normalizedPrivate = strtolower(str_replace('\\', '/', $privateRoot)) . '/';
$normalizedPublic = strtolower(str_replace('\\', '/', $publicRoot)) . '/';
if (str_starts_with($normalizedPrivate, $normalizedPublic)) rv_abort(503, 'O armazenamento reservado precisa ser configurado pela equipe responsável.');
define('RV_PRIVATE', $privateRoot);
foreach (['runtime', 'runtime/sessions', 'runtime/attempts'] as $directory) {
    $path = RV_PRIVATE . '/' . $directory;
    if (!is_dir($path) && !mkdir($path, 0700, true) && !is_dir($path)) rv_abort(503, 'Não foi possível iniciar o acesso reservado. Tente novamente mais tarde.');
}
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.gc_maxlifetime', '28800');
session_save_path(RV_PRIVATE . '/runtime/sessions');
session_name('PLENA_REVENDA');
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => !rv_local(), 'httponly' => true, 'samesite' => 'Lax']);
if (!session_start()) rv_abort(503, 'Não foi possível iniciar sua sessão. Tente novamente.');
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
$configPath = RV_PRIVATE . '/config.php';
// A troca da credencial deve ser percebida mesmo em hospedagens com OPcache.
if (is_file($configPath) && function_exists('opcache_invalidate')) @opcache_invalidate($configPath, true);
$config = is_file($configPath) ? require $configPath : null;
if ($config !== null && (!is_array($config) || empty($config['username']) || empty($config['password_hash']) || empty($config['security_key']))) rv_abort(503, 'O acesso reservado está em atualização. Entre em contato com a Plena-Lab.');

function rv_csrf_valid(mixed $value): bool { return is_string($value) && hash_equals($_SESSION['csrf'], $value); }
function rv_authenticated(?array $config): bool {
    $auth = $_SESSION['auth'] ?? null;
    if (!$config || !is_array($auth)) return false;
    $now = time();
    if (!hash_equals(hash('sha256', $config['password_hash']), $auth['version'] ?? '') || $now - ($auth['last'] ?? 0) > 1800 || $now - ($auth['started'] ?? 0) > 28800) {
        unset($_SESSION['auth']);
        return false;
    }
    $_SESSION['auth']['last'] = $now;
    return true;
}

// Limite de tentativas por IP, com bloqueio de arquivo e estado fora da área pública.
function rv_login_attempt(array $config, string $username, string $password): array {
    $key = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? '', $config['security_key']);
    $handle = fopen(RV_PRIVATE . '/runtime/attempts/' . $key . '.json', 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) return ['status' => 'unavailable'];
    try {
        $raw = stream_get_contents($handle);
        $state = json_decode($raw ?: '{}', true) ?: [];
        $now = time();
        if (($state['blocked_until'] ?? 0) > $now) return ['status' => 'blocked', 'retry' => $state['blocked_until'] - $now];
        if ($now - ($state['window'] ?? 0) > 600) $state = ['window' => $now, 'failures' => 0];
        $passwordOk = password_verify($password, $config['password_hash']);
        $valid = hash_equals($config['username'], $username) && $passwordOk;
        if ($valid) $state = ['window' => $now, 'failures' => 0];
        else {
            $state['failures'] = ($state['failures'] ?? 0) + 1;
            if ($state['failures'] >= 6) $state['blocked_until'] = $now + 300;
        }
        rewind($handle); ftruncate($handle, 0); fwrite($handle, json_encode($state)); fflush($handle);
        return ['status' => $valid ? 'ok' : (isset($state['blocked_until']) ? 'blocked' : 'invalid'), 'retry' => 300];
    } finally { flock($handle, LOCK_UN); fclose($handle); }
}
function rv_documents(): array {
    $docs = json_decode(file_get_contents(__DIR__ . '/documentos.json'), true, 32, JSON_THROW_ON_ERROR);
    foreach ($docs as &$doc) {
        $file = RV_PRIVATE . '/files/' . $doc['file'];
        $doc['available'] = is_file($file) && is_readable($file);
        $doc['bytes'] = $doc['available'] ? filesize($file) : 0;
    }
    return $docs;
}
function rv_size(int $bytes): string { return $bytes >= 1048576 ? number_format($bytes / 1048576, 1, ',', '.') . ' MB' : number_format($bytes / 1024, 0, ',', '.') . ' KB'; }
