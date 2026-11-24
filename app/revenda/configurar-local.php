<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
if (!rv_local() || $config !== null) rv_abort(404, 'Página não encontrada.');
$setupError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!rv_csrf_valid($_POST['csrf'] ?? null)) rv_abort(403, 'Reabra a configuração local e tente novamente.');
    $newUser = is_string($_POST['username'] ?? null) ? trim($_POST['username']) : '';
    $newPassword = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
    $confirmation = is_string($_POST['confirmation'] ?? null) ? $_POST['confirmation'] : '';
    if (!preg_match('/^[a-zA-Z0-9._-]{3,64}$/D', $newUser)) $setupError = 'Use de 3 a 64 letras, números, pontos, hífens ou sublinhados no usuário.';
    elseif (str_contains($newPassword, "\0") || preg_match_all('/./us', $newPassword) < 14 || strlen($newPassword) > 72) $setupError = 'Escolha uma senha com pelo menos 14 caracteres e no máximo 72 bytes. Uma frase exclusiva é uma boa opção.';
    elseif (!hash_equals($newPassword, $confirmation)) $setupError = 'A confirmação precisa ser igual à senha.';
    else {
        $settings = ['username' => $newUser, 'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT), 'security_key' => bin2hex(random_bytes(32))];
        $handle = @fopen(RV_PRIVATE . '/config.php', 'x');
        if (!$handle) $setupError = 'Não foi possível salvar. O acesso pode já ter sido configurado.';
        else {
            fwrite($handle, "<?php\nreturn " . var_export($settings, true) . ";\n"); fclose($handle); @chmod(RV_PRIVATE . '/config.php', 0600);
            unset($newPassword, $confirmation, $settings);
            session_regenerate_id(true); $_SESSION['csrf'] = bin2hex(random_bytes(32));
            header('Location: revendedores.php', true, 303); exit;
        }
    }
    unset($newPassword, $confirmation);
}
?>
<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Configurar prévia local | Plena-Lab</title><link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-plena-lab.png?v=3"><script src="/favicon.js" defer></script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=20261124-animacoes"><link rel="stylesheet" href="revendedores.css?v=20261124-listas-comerciais"></head><body class="reseller-page"><main class="reseller-setup"><section class="reseller-login"><h1>Defina o acesso<br>da prévia local.</h1><p>Escolha o usuário e a senha para testar a área. A senha não será exibida no chat nem salva em texto aberto. Esta configuração só está disponível neste computador e se encerra após salvar.</p><?php if ($setupError): ?><div role="alert" class="reseller-error"><?= rv_escape($setupError) ?></div><?php endif; ?><form method="post" action="configurar-acesso-local.php" class="reseller-login-form"><input type="hidden" name="csrf" value="<?= rv_escape($_SESSION['csrf']) ?>"><div class="reseller-field"><label for="setup-user">Usuário compartilhado</label><input id="setup-user" name="username" required minlength="3" maxlength="64" autocomplete="username" pattern="[a-zA-Z0-9._-]{3,64}"></div><div class="reseller-field"><label for="setup-password">Senha — mínimo de 14 caracteres</label><input id="setup-password" name="password" type="password" required minlength="14" maxlength="72" autocomplete="new-password"></div><div class="reseller-field"><label for="setup-confirmation">Confirmar senha</label><input id="setup-confirmation" name="confirmation" type="password" required minlength="14" maxlength="72" autocomplete="new-password"></div><button class="button button-primary reseller-submit" type="submit">Salvar acesso local</button></form><p class="reseller-help">Antes da publicação, será preciso definir a credencial oficial e configurar HTTPS e armazenamento privado na hospedagem.</p></section></main></body></html>
