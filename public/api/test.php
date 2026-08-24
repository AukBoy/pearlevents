<?php
header("Content-Type: text/html; charset=UTF-8");
require_once __DIR__ . '/config.php';

echo "<h2>Zircon Host MySQL Connection Diagnostic Test</h2>";

echo "<ul>";
echo "<li><strong>DB_HOST:</strong> " . DB_HOST . "</li>";
echo "<li><strong>DB_USER:</strong> " . DB_USER . "</li>";
echo "<li><strong>DB_NAME:</strong> " . DB_NAME . "</li>";
echo "</ul>";

if (DB_USER === 'YOUR_CPANEL_DB_USER' || DB_NAME === 'YOUR_CPANEL_DB_NAME') {
    echo "<p style='color: red; font-weight: bold;'>⚠️ ATTENTION: You still have placeholder values inside api/config.php! Please edit api/config.php in cPanel File Manager and replace 'YOUR_CPANEL_DB_USER', 'YOUR_CPANEL_DB_PASSWORD', and 'YOUR_CPANEL_DB_NAME' with your actual cPanel MySQL credentials.</p>";
    exit();
}

try {
    $pdo = getDBConnection();
    echo "<p style='color: green; font-weight: bold; font-size: 18px;'>✅ SUCCESS! Database connected successfully!</p>";

    // Test table existence
    $stmt = $pdo->query("SHOW TABLES LIKE 'bookings'");
    $tableExists = $stmt->fetch();

    if ($tableExists) {
        $countStmt = $pdo->query("SELECT COUNT(*) as cnt FROM bookings");
        $count = $countStmt->fetch()['cnt'];
        echo "<p style='color: green;'>✅ 'bookings' table exists with <strong>$count</strong> records!</p>";
    } else {
        echo "<p style='color: orange; font-weight: bold;'>⚠️ 'bookings' table does not exist in database yet! Please import public/api/schema.sql into phpMyAdmin.</p>";
    }

} catch (Exception $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ CONNECTION ERROR: " . $e->getMessage() . "</p>";
}
?>
