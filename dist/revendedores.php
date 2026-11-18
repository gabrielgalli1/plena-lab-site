<?php
declare(strict_types=1);
require dirname(__DIR__) . '/app/revenda/bootstrap.php';
$error = '';
$username = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!rv_csrf_valid($_POST['csrf'] ?? null)) rv_abort(403, 'Sua sessão de formulário expirou. Volte à página de acesso e tente novamente.');
    $action = $_POST['action'] ?? '';
    if ($action === 'logout') {
        $_SESSION = [];
        $params = session_get_cookie_params();
        setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => $params['path'], 'secure' => $params['secure'], 'httponly' => true, 'samesite' => 'Lax']);
        session_destroy();
        header('Location: revendedores.php', true, 303); exit;
    }
    if ($action !== 'login') rv_abort(400, 'Solicitação inválida.');
    $username = is_string($_POST['username'] ?? null) ? trim($_POST['username']) : '';
    $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
    if (!$config) { http_response_code(503); $error = 'Estamos preparando o acesso reservado. Fale com nossa equipe.'; }
    elseif (strlen($username) > 64 || strlen($password) > 72 || str_contains($password, "\0") || $username === '' || $password === '') { http_response_code(401); $error = 'Usuário ou senha inválidos. Confira os dados enviados pela Plena-Lab.'; }
    else {
        $result = rv_login_attempt($config, $username, $password);
        if ($result['status'] === 'ok') {
            session_regenerate_id(true);
            $_SESSION = ['csrf' => bin2hex(random_bytes(32)), 'auth' => ['started' => time(), 'last' => time(), 'version' => hash('sha256', $config['password_hash'])]];
            header('Location: revendedores.php', true, 303); exit;
        }
        if ($result['status'] === 'blocked') { http_response_code(429); header('Retry-After: ' . $result['retry']); $error = 'Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.'; }
        elseif ($result['status'] === 'unavailable') { http_response_code(503); $error = 'Acesso temporariamente indisponível. Tente novamente mais tarde.'; }
        else { http_response_code(401); $error = 'Usuário ou senha inválidos. Confira os dados enviados pela Plena-Lab.'; }
    }
    unset($password);
} elseif ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') rv_abort(405, 'Método não permitido.');
$authenticated = rv_authenticated($config);
$documents = $authenticated ? rv_documents() : [];
require dirname(__DIR__) . '/app/revenda/pagina.php';
