# Security Report: SQL Injection in admin/modules.php

**ID:** GHSA-g443-8869-6g52
**Severity:** High
**Reporter:** cdkkx
**Date:** Jul 2, 2026

## Summary
A SQL Injection vulnerability in the Zen Cart administrative backend allows an authenticated administrator to execute arbitrary SQL commands. By manipulating the keys of the `configuration` POST array during a module update, an attacker can inject malicious SQL into the application's database queries.

## Details
The vulnerability is located in `modules.php` (within the administrative directory). When saving module configurations, the application iterates through the `$_POST['configuration']` array. The keys of this array are used directly in SQL queries without sufficient sanitization or the use of prepared statements. This allows an attacker to break out of the intended query structure and execute arbitrary SQL.

## Proof of Concept (PoC)
1. Log in to the Zen Cart administrative panel with a valid account.
2. Navigate to **Modules -> Payment** (or any module using the standard configuration edit page).
3. Select a module (e.g., `MoneyOrder`) and click **Edit**.
4. Capture the "Save" request using a proxy tool (like Burp Suite).
5. Modify the configuration parameter keys in the POST body to include a SQL injection payload.
   - **Example Payload Key:** `configuration[INVALID' UNION SELECT SLEEP(5), '2' #]`
   - **Full Parameter Example:** `securityToken=[TOKEN]&action=saveall&configuration[INVALID' UNION SELECT SLEEP(5), '2' #]=test`
6. Send the request and observe a 5-second delay in the server response, confirming the execution of the `SLEEP()` command.

## Impact
- **Vulnerability Type:** SQL Injection (CWE-89)
- **Impacted Parties:** This affects all Zen Cart installations where the administrative directory is accessible.
- **Consequences:** An authenticated attacker can gain full read/write access to the database, allowing for data theft, modification of store settings, and potentially escalating privileges or gaining remote code execution (e.g., via the `eval()` or file write vulnerabilities reported separately).

## Weakness
- **CWE-89:** Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')
