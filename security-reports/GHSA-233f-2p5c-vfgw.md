# Security Report: Remote Code Execution (RCE) via Unsafe eval() in admin/configuration.php

**ID:** GHSA-233f-2p5c-vfgw
**Severity:** Critical
**Reporter:** cdkkx
**Date:** Jul 2, 2026

## Summary
The Zen Cart admin panel is vulnerable to Remote Code Execution (RCE) because it retrieves configuration settings from the database and passes them directly to the PHP `eval()` function without sufficient sanitization or validation.

## Details
In the administrative configuration management (`admin/configuration.php`), the system processes configuration entries. For certain configuration keys, the field `set_function` is retrieved from the `configuration` table in the database. This field is intended to contain a function call used to display an input field for the setting. However, the code uses `eval()` to execute the string stored in `set_function`. If an attacker can modify this database entry (e.g., via a separate SQL injection vulnerability), they can inject arbitrary PHP code that will be executed when an administrator views the configuration page.

## Proof of Concept (PoC)
1. **Prerequisites:**
   - Administrative access to the Zen Cart backend.
   - Valid `zenAdminID` session cookie and `securityToken`.
2. **Step 1: Injecting the Payload via SQL Injection**
   The attacker uses a separate SQL injection (e.g., in `admin/modules.php`) to overwrite a configuration entry:
   ```sql
   UPDATE configuration SET set_function = 'system("id");' WHERE configuration_key = 'STORE_NAME';
   ```
3. **Step 2: Triggering the RCE**
   The attacker navigates to the configuration page: `admin/configuration.php?gID=1`.
4. The system retrieves the malicious `set_function` and executes it via `eval()`.
5. The output of the `id` command is rendered in the administrator's browser.

## Impact
Successful exploitation allows an attacker to execute arbitrary system commands with the privileges of the web server user. This can lead to:
- Full server compromise.
- Access to sensitive customer and payment data.
- Defacement or complete deletion of the store.

## Weakness
- **CWE-94:** Improper Control of Generation of Code ('Code Injection')
- **CWE-95:** Improper Neutralization of Directives in Dynamically Evaluated Code ('Eval Injection')
