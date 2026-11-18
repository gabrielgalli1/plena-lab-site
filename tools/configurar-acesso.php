<?php
declare(strict_types=1);
// Ferramenta CLI. Nunca copiar para a pasta pública.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$path = getenv('PLENA_REVENDA_PRIVATE');
if (!$path || !is_dir($path)) { fwrite(STDERR, "Defina PLENA_REVENDA_PRIVATE para a pasta privada fora da raiz pública.\n"); exit(1); }
$resolved = realpath($path);
$public = realpath(dirname(__DIR__) . '/dist');
if ($public && str_starts_with(strtolower(str_replace('\\', '/', $resolved)) . '/', strtolower(str_replace('\\', '/', $public)) . '/')) { fwrite(STDERR, "A configuração não pode ficar na pasta pública.\n"); exit(1); }
$payload = json_decode(stream_get_contents(STDIN), true);
if (!is_array($payload) || !is_string($payload['username'] ?? null) || !is_string($payload['password'] ?? null)) { fwrite(STDERR, "Informe os dados pela entrada padrão.\n"); exit(1); }
$username = trim($payload['username']); $password = $payload['password'];
if (!preg_match('/^[a-zA-Z0-9._-]{3,64}$/D', $username) || str_contains($password, "\0") || preg_match_all('/./us', $password) < 14 || strlen($password) > 72) { fwrite(STDERR, "Usuário ou senha fora dos limites permitidos.\n"); exit(1); }
$settings = ['username' => $username, 'password_hash' => password_hash($password, PASSWORD_DEFAULT), 'security_key' => bin2hex(random_bytes(32))];
$temporary = rtrim($path, '/\\') . '/.config-' . bin2hex(random_bytes(12)) . '.tmp';
$content = "<?php\nreturn " . var_export($settings, true) . ";\n";
if (file_put_contents($temporary, $content, LOCK_EX) === false) { fwrite(STDERR, "Não foi possível gravar a configuração privada.\n"); exit(1); }
@chmod($temporary, 0600);
if (!rename($temporary, rtrim($path, '/\\') . '/config.php')) { @unlink($temporary); fwrite(STDERR, "Não foi possível concluir a configuração.\n"); exit(1); }
unset($payload, $password, $settings, $content);
echo "Acesso configurado. Sessões anteriores serão invalidadas. Nenhuma senha foi exibida.\n";
