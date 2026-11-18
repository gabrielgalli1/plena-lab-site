<?php
declare(strict_types=1);
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if ($path === '/configurar-acesso-local.php') {
    if (getenv('PLENA_LOCAL') !== '1' || !in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) { http_response_code(404); exit; }
    require dirname(__DIR__) . '/app/revenda/configurar-local.php';
    return true;
}
if ($path === '/revendedores.html') { header('Location: /revendedores.php', true, 302); return true; }
$public = realpath(dirname(__DIR__) . '/dist');
$decoded = rawurldecode(is_string($path) ? $path : '/');
$target = str_contains($decoded, "\0") ? false : realpath($public . '/' . ltrim($decoded, '/'));
// O servidor embutido do PHP pode responder index.html para caminhos inexistentes.
// Aqui, arquivos privados, ocultos e caminhos desconhecidos precisam ser 404 reais.
if (preg_match('~(?:^|/)\.~', $decoded) || !$target
    || !str_starts_with(strtolower(str_replace('\\', '/', $target)) . '/', strtolower(str_replace('\\', '/', $public)) . '/')
    || (is_dir($target) && !is_file($target . '/index.html'))) {
    http_response_code(404); header('Content-Type: text/plain; charset=utf-8'); echo 'Página não encontrada.'; return true;
}
return false;
