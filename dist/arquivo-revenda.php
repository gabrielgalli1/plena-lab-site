<?php
declare(strict_types=1);
require dirname(__DIR__) . '/app/revenda/bootstrap.php';
if (!rv_authenticated($config)) rv_abort(401, 'Acesso reservado. Entre na área de revendedores para consultar este arquivo.');
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'], true)) rv_abort(405, 'Método não permitido.');
$id = is_string($_GET['id'] ?? null) ? $_GET['id'] : '';
$document = null;
foreach (rv_documents() as $candidate) if (hash_equals($candidate['id'], $id)) { $document = $candidate; break; }
if (!$document || !$document['available']) rv_abort(404, 'Arquivo indisponível. Entre em contato com a Plena-Lab.');
$path = RV_PRIVATE . '/files/' . $document['file'];
session_write_close();
$size = filesize($path);
$start = 0; $end = $size - 1;
if (isset($_SERVER['HTTP_RANGE'])) {
    if (!preg_match('/^bytes=(\d*)-(\d*)$/D', $_SERVER['HTTP_RANGE'], $match) || ($match[1] === '' && $match[2] === '')) {
        header('Content-Range: bytes */' . $size); rv_abort(416, 'Intervalo inválido.');
    }
    if ($match[1] === '') { $suffix = (int)$match[2]; if ($suffix <= 0) { header('Content-Range: bytes */' . $size); rv_abort(416, 'Intervalo inválido.'); } $start = max(0, $size - $suffix); }
    else { $start = (int)$match[1]; if ($match[2] !== '') $end = min((int)$match[2], $end); }
    if ($start >= $size || $start > $end) { header('Content-Range: bytes */' . $size); rv_abort(416, 'Intervalo inválido.'); }
    http_response_code(206); header("Content-Range: bytes $start-$end/$size");
}
$inline = $document['type'] === 'pdf' && ($_GET['acao'] ?? '') === 'abrir';
header('Content-Type: ' . ($document['type'] === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'));
header('Content-Disposition: ' . ($inline ? 'inline' : 'attachment') . '; filename="Plena-Lab-' . $document['file'] . '"');
header('Accept-Ranges: bytes');
header('Content-Length: ' . ($end - $start + 1));
if ($_SERVER['REQUEST_METHOD'] === 'HEAD') exit;
$handle = fopen($path, 'rb');
if (!$handle) rv_abort(404, 'Arquivo temporariamente indisponível.');
fseek($handle, $start);
$remaining = $end - $start + 1;
while ($remaining > 0 && !feof($handle) && !connection_aborted()) {
    $chunk = fread($handle, min(65536, $remaining));
    if ($chunk === false || $chunk === '') break;
    echo $chunk; $remaining -= strlen($chunk);
}
fclose($handle);
