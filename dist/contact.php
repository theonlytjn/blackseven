<?php
/**
 * Black Seven — form mail handler
 * ---------------------------------------------------------------------------
 * Receives submissions from the contact form and the newsletter footer form,
 * then emails them to richard@blackseven.co using PHP's mail().
 *
 * Deploy: this file is copied into dist/ by the Vite build. Upload it to
 * public_html alongside the site so the front-end can POST to /contact.php.
 *
 * IMPORTANT for deliverability on cPanel / UK Host4u:
 *   - $FROM must be an address on your own domain (blackseven.co). Create the
 *     mailbox (or an alias/forwarder) "website@blackseven.co" in cPanel, or
 *     change $FROM below to one that already exists. Sending "From" an address
 *     on a domain you don't control is what usually trips spam filters.
 *   - Replies go to the visitor's own address (Reply-To), so hitting reply in
 *     richard@blackseven.co's inbox answers the enquirer directly.
 * ---------------------------------------------------------------------------
 */

// ---- Configuration ---------------------------------------------------------
$TO   = 'richard@blackseven.co';        // where enquiries are delivered
$FROM = 'website@blackseven.co';        // must be on your domain — see note above
$SITE = 'Black Seven';

// ---- Only accept POST ------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ---- Helpers ---------------------------------------------------------------
/** Collapse newlines so submitted values can't inject extra mail headers. */
function clean($value) {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', (string) $value));
}
function field($key) {
    return isset($_POST[$key]) ? clean($_POST[$key]) : '';
}
function fail($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

// ---- Honeypot: silently accept obvious bots --------------------------------
if (!empty($_POST['botcheck'])) {
    echo json_encode(['success' => true, 'message' => 'Thanks — your message has been sent.']);
    exit;
}

// ---- Read + validate -------------------------------------------------------
$formType = field('form_type') ?: 'contact';
$name     = field('name');
$email    = field('email');

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Please enter a valid email address.');
}

if ($formType === 'newsletter') {
    $subject = "Newsletter signup — {$SITE}";
    $body  = "New newsletter signup.\n\n";
    $body .= 'Name:  ' . ($name !== '' ? $name : '(not given)') . "\n";
    $body .= 'Email: ' . $email . "\n";
} else {
    // Contact enquiry
    $company = field('company');
    // Message may legitimately contain line breaks, so don't run it through clean().
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    if ($name === '')    fail('Please enter your name.');
    if ($company === '') fail('Please enter your company.');
    if ($message === '') fail('Please enter a message.');

    $subject = "Website enquiry — {$SITE}";
    $body  = "New enquiry from the Black Seven website.\n\n";
    $body .= 'Name:    ' . $name . "\n";
    $body .= 'Email:   ' . $email . "\n";
    $body .= 'Company: ' . $company . "\n\n";
    $body .= "Message:\n" . $message . "\n";
}

// ---- Build headers ---------------------------------------------------------
$fromName = ($formType === 'newsletter' ? 'Black Seven Newsletter' : 'Black Seven Website');

$headers  = 'From: ' . $fromName . ' <' . $FROM . '>' . "\r\n";
$headers .= 'Reply-To: ' . ($name !== '' ? $name . ' <' . $email . '>' : $email) . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/plain; charset=utf-8' . "\r\n";

// Envelope sender — helps SPF/deliverability on shared cPanel hosts.
$params = '-f ' . $FROM;

// ---- Send ------------------------------------------------------------------
$sent = @mail($TO, $subject, $body, $headers, $params);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => $formType === 'newsletter'
            ? 'Thanks — you have been added to the list.'
            : 'Thanks — your message has been sent.',
    ]);
} else {
    fail('The message could not be sent. Please email richard@blackseven.co directly.', 500);
}
