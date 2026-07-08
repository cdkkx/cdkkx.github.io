# Security Report: Remote Code Execution (RCE) via Arbitrary File Write in define_pages_editor.php

**ID:** GHSA-h8p9-prrx-jx6r
**Severity:** Critical
**Reporter:** cdkkx
**Date:** Jul 3, 2026

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

## Impact
This vulnerability allows for persistent Remote Code Execution. Once the file is written, the attacker can execute arbitrary commands without needing to maintain an active admin session. This leads to full system compromise, data theft, and potential lateral movement within the network.

## Weakness
- **CWE-434:** Unrestricted Upload of File with Dangerous Type
