# Security Report: Remote Code Execution (RCE) via Unsafe Dynamic Function Call

**ID:** GHSA-xrv3-wg8v-w8q8
**Severity:** Critical
**Reporter:** cdkkx
**Date:** Jul 2, 2026

## Summary
Zen Cart 2.2.2 is vulnerable to Remote Code Execution (RCE) due to an unsafe dynamic function call mechanism in the administrative module management component. An attacker can leverage this to call arbitrary PHP functions with arbitrary arguments.

## Details
The vulnerability exists in the interaction between `admin/modules.php` and the helper function `zen_call_function` defined in `admin/includes/functions/general.php`. In `admin/modules.php`, the code retrieves configuration values from the database, including a function name stored in the `use_function` column and a value in the `configuration_value` column. These are passed directly to `zen_call_function`, which executes the function using `call_user_func()`. Since an administrator can modify the database via the "SQL Patch" tool or other means, they can set `use_function` to a dangerous function like `system` and `configuration_value` to a malicious command.

## Proof of Concept (PoC)
1. Log in to the Zen Cart admin panel.
2. Use the **SQL Patch** tool (`cmd=sqlpatch`) to inject the payload:
   ```sql
   UPDATE configuration SET use_function = 'system', configuration_value = 'id > /tmp/rce_call_user_func.txt' WHERE configuration_key = 'MODULE_SHIPPING_FLAT_STATUS';
   ```
3. Navigate to the Shipping Modules page: `index.php?cmd=modules&set=shipping`.
4. The `zen_call_function` will be triggered during the page rendering, executing `system('id > /tmp/rce_call_user_func.txt')`.
5. Check `/tmp/rce_call_user_func.txt` for the command output.

## Impact
This vulnerability allows authenticated administrators (or attackers who can modify the database) to execute arbitrary system commands on the server. This results in full compromise of the web server, data breach, and potential persistent access.

## Weakness
- **CWE-94:** Improper Control of Generation of Code ('Code Injection')
