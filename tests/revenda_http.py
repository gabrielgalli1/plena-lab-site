"""Regressão HTTP isolada. Usa arquivos fictícios e credencial aleatória, nunca a lista real."""
from pathlib import Path
import argparse, base64, hashlib, http.cookiejar, json, os, re, secrets, shutil, socket, subprocess, time
from urllib.request import Request, build_opener, HTTPCookieProcessor, HTTPRedirectHandler
from urllib.error import HTTPError, URLError

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None

parser=argparse.ArgumentParser();parser.add_argument('--php',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
test_base=(root.parent.parent/'work/revendedores/testes-http').resolve();test_base.mkdir(parents=True,exist_ok=True)
private=test_base/secrets.token_hex(10);private.mkdir();(private/'files').mkdir()
assert private.resolve().is_relative_to(test_base)
documents=json.loads((root/'app/revenda/documentos.json').read_text(encoding='utf-8'))
fixture=b'%PDF-1.4\nARQUIVO FICTICIO PARA TESTE DE CONTROLE DE ACESSO\n'
for doc in documents:(private/'files'/doc['file']).write_bytes(fixture)
password=secrets.token_urlsafe(28);username='revenda-teste-isolado'
password_hash=subprocess.run([args.php,'-r','echo password_hash(stream_get_contents(STDIN), PASSWORD_DEFAULT);'],input=password,text=True,capture_output=True,check=True).stdout
def write_config(pw_hash):
    content=base64.b64encode(json.dumps({'username':username,'password_hash':pw_hash,'security_key':secrets.token_hex(32)}).encode()).decode()
    (private/'config.php').write_text("<?php return json_decode(base64_decode('"+content+"'), true);",encoding='utf-8')
write_config(password_hash)
with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
env=dict(os.environ,PLENA_LOCAL='1',PLENA_REVENDA_PRIVATE=str(private))
server=subprocess.Popen([args.php,'-d','display_errors=0','-S',f'127.0.0.1:{port}','-t',str(root/'dist'),str(root/'tools/router-local.php')],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
base=f'http://127.0.0.1:{port}'
jar=http.cookiejar.CookieJar();client=build_opener(HTTPCookieProcessor(jar),NoRedirect())
def request(path,form=None,headers=None,opener=None,method=None):
    from urllib.parse import urlencode
    data=urlencode(form).encode() if form is not None else None
    req=Request(base+path,data=data,headers=headers or {},method=method)
    try:
        with (opener or client).open(req,timeout=5) as response:return response.status,response.headers,response.read()
    except HTTPError as error:return error.code,error.headers,error.read()
def token():
    status,_,body=request('/revendedores.php');assert status==200
    return re.search(rb'name="csrf" value="([a-f0-9]+)"',body)[1].decode()
def login():
    csrf=token();status,_,_=request('/revendedores.php',{'action':'login','csrf':csrf,'username':username,'password':password});assert status==303,'Login válido não foi aceito.'
def session_id():return next(c.value for c in jar if c.name=='PLENA_REVENDA')
checks=[]
try:
    for _ in range(60):
        try:request('/revendedores.php');break
        except (URLError,ConnectionError):time.sleep(.1)
    assert request('/arquivo-revenda.php?id=excel')[0]==401;checks.append('bloqueio sem login')
    for url in ['/private/files/porcelanas.pdf','/files/porcelanas.pdf','/app/revenda/documentos.json','/config.php','/.env']:
        assert request(url)[0]==404
    checks.append('caminhos privados e inexistentes não são servidos')
    assert request('/revendedores.php',{'action':'login','csrf':'incorreto','username':username,'password':password})[0]==403;checks.append('CSRF de login')
    old_session=session_id();login();assert session_id()!=old_session;checks.append('rotação da sessão')
    for cookie in jar:
        if cookie.name=='PLENA_REVENDA':assert cookie.has_nonstandard_attr('HttpOnly') and cookie.get_nonstandard_attr('SameSite')=='Lax'
    for doc in documents:
        status,headers,body=request('/arquivo-revenda.php?id='+doc['id'])
        assert status==200 and body==fixture and 'attachment' in headers['Content-Disposition'] and 'no-store' in headers['Cache-Control']
    checks.append('13 downloads com bytes íntegros e sem cache')
    status,headers,body=request('/arquivo-revenda.php?id=porcelanas&acao=abrir',headers={'Range':'bytes=0-3'})
    assert status==206 and body==fixture[:4] and 'inline' in headers['Content-Disposition'];checks.append('PDF inline e range')
    assert request('/arquivo-revenda.php?id=porcelanas',headers={'Range':'bytes=99999999-'})[0]==416
    assert request('/arquivo-revenda.php?id=..%2Fconfig.php')[0]==404;checks.append('identificador fechado e intervalo inválido')
    status,headers,body=request('/arquivo-revenda.php?id=excel',method='HEAD');assert status==200 and not body and int(headers['Content-Length'])==len(fixture)
    csrf=token();assert request('/revendedores.php',{'action':'logout','csrf':'incorreto'})[0]==403
    assert request('/arquivo-revenda.php?id=excel')[0]==200
    assert request('/revendedores.php',{'action':'logout','csrf':csrf})[0]==303
    assert request('/arquivo-revenda.php?id=excel')[0]==401;checks.append('logout protegido e revogação')
    login()
    session_file=private/'runtime/sessions'/('sess_'+session_id())
    text=session_file.read_text();text,n=re.subn(r's:4:"last";i:\d+;',lambda m:'s:4:"last";i:'+str(int(time.time())-1900)+';',text);assert n==1;session_file.write_text(text)
    assert request('/arquivo-revenda.php?id=excel')[0]==401;checks.append('expiração por inatividade')
    login()
    write_config(subprocess.run([args.php,'-r','echo password_hash(stream_get_contents(STDIN), PASSWORD_DEFAULT);'],input=secrets.token_urlsafe(28),text=True,capture_output=True,check=True).stdout)
    assert request('/arquivo-revenda.php?id=excel')[0]==401;checks.append('troca de senha invalida sessões')
    csrf=token();statuses=[request('/revendedores.php',{'action':'login','csrf':csrf,'username':username,'password':'senha-incorreta-de-teste'})[0] for _ in range(6)]
    assert statuses==[401]*5+[429]
    other=build_opener(HTTPCookieProcessor(http.cookiejar.CookieJar()),NoRedirect())
    body=request('/revendedores.php',opener=other)[2];fresh=re.search(rb'name="csrf" value="([a-f0-9]+)"',body)[1].decode()
    assert request('/revendedores.php',{'action':'login','csrf':fresh,'username':username,'password':'incorreta'},opener=other)[0]==429;checks.append('limite por IP persiste sem cookie')
    assert request('/configurar-acesso-local.php')[0]==404;checks.append('configuração inicial encerrada')
    secure_script="$_SERVER['DOCUMENT_ROOT']=$argv[1];$_SERVER['HTTPS']='on';$_SERVER['REMOTE_ADDR']='203.0.113.1';require $argv[2];echo json_encode(session_get_cookie_params());"
    params=json.loads(subprocess.run([args.php,'-r',secure_script,str(root/'dist'),str(root/'app/revenda/bootstrap.php')],env=env,text=True,capture_output=True,check=True).stdout)
    assert params['secure'] and params['httponly'] and params['samesite']=='Lax';checks.append('cookie Secure fora do desenvolvimento local')
    print(str(len(checks))+' cenários aprovados: '+', '.join(checks)+'.')
finally:
    server.terminate();server.wait(timeout=5)
    assert private.resolve().is_relative_to(test_base)
    shutil.rmtree(private)
