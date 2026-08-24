<?php
header("Content-Type: text/html; charset=UTF-8");

$msg = "";
$status = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = trim($_POST['db_host'] ?? 'localhost');
    $dbName = trim($_POST['db_name'] ?? '');
    $dbUser = trim($_POST['db_user'] ?? '');
    $dbPass = trim($_POST['db_pass'] ?? '');

    if (empty($dbName) || empty($dbUser)) {
        $msg = "Please fill in Database Name and Database User!";
        $status = "error";
    } else {
        try {
            // 1. Test Connection
            $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            // 2. Create Table
            $sql = "CREATE TABLE IF NOT EXISTS `bookings` (
              `id` INT AUTO_INCREMENT PRIMARY KEY,
              `ref_no` VARCHAR(20) NOT NULL,
              `booked_date` DATE NOT NULL,
              `event_date` DATE NOT NULL,
              `place` VARCHAR(255) NOT NULL,
              `phone` VARCHAR(50) NOT NULL,
              `time` VARCHAR(50) NOT NULL,
              `items` TEXT NOT NULL,
              `full_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
              `advance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
              `extra_info` TEXT,
              `status` ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
              `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            $pdo->exec($sql);

            // 3. Seed initial 13 records if empty
            $countStmt = $pdo->query("SELECT COUNT(*) as cnt FROM bookings");
            if ($countStmt->fetch()['cnt'] == 0) {
                $seedSql = "INSERT INTO `bookings` (`id`, `ref_no`, `booked_date`, `event_date`, `place`, `phone`, `time`, `items`, `full_amount`, `advance`, `extra_info`, `status`) VALUES
                (1, '01', '2026-08-01', '2026-08-01', 'Colombo', '0774939597', '6:00 AM', 'Boy or Girl / Event Deco', 15000.00, 0.00, 'Event decoration package', 'completed'),
                (2, '02', '2026-08-03', '2026-08-03', 'Kurunegala', '0774354140', '7:00 PM', 'Vehicle B''day Surprise', 11000.00, 0.00, '-5000/= vehicle damage adjustment included', 'completed'),
                (3, '03', '2026-08-10', '2026-08-10', 'Wennappuwa', '0763355020', '7:00 PM', 'Vehicle B''day Surprise', 15000.00, 0.00, 'Frame, max size photo add, special candles', 'completed'),
                (4, '04', '2026-08-09', '2026-08-20', 'Negombo', '0763699684', '7:00 PM', 'Vehicle Surprise', 15000.00, 5000.00, 'Standard surprise setup', 'pending'),
                (5, '05', '2026-08-20', '2026-08-29', 'Indigolla', '+6581008053', '7:00 PM', 'Vehicle Surprise', 15500.00, 13100.00, 'For 2 persons with 2 printed photos', 'pending'),
                (6, '06', '2026-08-15', '2026-08-15', 'Ittaepana', '+971551686480', '12:00 AM Midnight', 'Vehicle Surprise', 16500.00, 6000.00, 'Fireworks show included', 'pending'),
                (7, '07', '2026-08-25', '2026-08-25', 'Veedagama', '0761944850', '7:00 PM', 'B''day Event Deco', 15000.00, 4000.00, 'Deco package breakdown (8,500 + 6,500)', 'pending'),
                (8, '08', '2026-08-21', '2026-08-21', 'Ekala Airforce Camp Rd', '0766940458', '7:00 PM', 'Vehicle Surprise', 15500.00, 5000.00, 'Camp road delivery point', 'pending'),
                (9, '09', '2026-08-10', '2026-08-20', 'Sri Jayawardenepura Kotte', '0740529368', '7:00 PM', 'Vehicle Surprise', 15000.00, 5000.00, 'Kotte area event setup', 'pending'),
                (10, '10', '2026-08-29', '2026-08-29', 'Malabe', '0768646330', '7:00 PM', 'Vehicle Surprise + Fireworks', 19500.00, 5000.00, 'Breakdown: 13500 base + 3000 deco + 3000 fireworks', 'pending'),
                (11, '11', '2026-09-02', '2026-09-02', 'Indigolla', '0772337063', '7:00 PM', 'Vehicle Surprise', 13500.00, 5000.00, '13,500 + pending transport fee to be added', 'pending'),
                (12, '12', '2026-09-08', '2026-09-08', 'Wathupitiwala', '0771260414', '8:00 PM', 'Vehicle Surprise', 15000.00, 5000.00, 'Breakdown: 13,500 + 1,500 transport', 'pending'),
                (13, '13', '2026-08-21', '2026-08-21', 'Malabadamulla / Malabe', '0767410697', '3:00 PM / 7:00 PM', 'Deco & Mascot', 23000.00, 5000.00, '673 Mascot + Photo frame (1 Year Birthday)', 'pending');";
                $pdo->exec($seedSql);
            }

            // 4. Save config.php
            $configContent = "<?php\n" .
                "define('DB_HOST', " . var_export($dbHost, true) . ");\n" .
                "define('DB_USER', " . var_export($dbUser, true) . ");\n" .
                "define('DB_PASS', " . var_export($dbPass, true) . ");\n" .
                "define('DB_NAME', " . var_export($dbName, true) . ");\n\n" .
                "function getDBConnection() {\n" .
                "    try {\n" .
                "        \$pdo = new PDO(\"mysql:host=\" . DB_HOST . \";dbname=\" . DB_NAME . \";charset=utf8mb4\", DB_USER, DB_PASS, [\n" .
                "            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,\n" .
                "            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n" .
                "            PDO::ATTR_EMULATE_PREPARES => false,\n" .
                "        ]);\n" .
                "        return \$pdo;\n" .
                "    } catch (PDOException \$e) {\n" .
                "        http_response_code(500);\n" .
                "        echo json_encode([\"error\" => \"Database Connection Failed: \" . \$e->getMessage()]);\n" .
                "        exit();\n" .
                "    }\n" .
                "}\n" .
                "?>";

            file_put_contents(__DIR__ . '/config.php', $configContent);

            $msg = "🎉 Database Connected & Configured Successfully! All 13 paper ledger bookings imported into Zircon Host MySQL!";
            $status = "success";

        } catch (Exception $e) {
            $msg = "Connection Failed: " . $e->getMessage();
            $status = "error";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zircon Host MySQL Database Setup</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #090d16; color: #f8fafc; padding: 2rem; }
        .container { max-width: 550px; margin: 0 auto; background: rgba(17, 24, 39, 0.9); border: 1px solid #f59e0b; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #f59e0b; font-size: 1.5rem; margin-top: 0; }
        label { display: block; font-size: 0.85rem; font-weight: bold; margin-top: 1rem; color: #cbd5e1; }
        input { width: 100%; padding: 0.65rem; margin-top: 0.3rem; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: white; box-sizing: border-box; }
        button { width: 100%; margin-top: 1.5rem; padding: 0.8rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: black; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
        button:hover { background: #fbbf24; }
        .alert { padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; font-weight: bold; }
        .alert.success { background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; }
        .alert.error { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚗 Surprise Drive - Database Setup</h1>
        <p style="font-size:0.85rem; color:#94a3b8;">Enter your Zircon Host cPanel MySQL Database credentials below. This tool will automatically connect, build the database tables, import your 13 ledger bookings, and save <code>config.php</code>!</p>
        
        <?php if ($msg): ?>
            <div class="alert <?php echo $status; ?>">
                <?php echo htmlspecialchars($msg); ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div>
                <label>Database Host</label>
                <input type="text" name="db_host" value="localhost" required />
            </div>
            <div>
                <label>Database Name (e.g. rakiyawa_surprisedrive)</label>
                <input type="text" name="db_name" placeholder="cpanelUser_databaseName" required />
            </div>
            <div>
                <label>Database Username (e.g. rakiyawa_user)</label>
                <input type="text" name="db_user" placeholder="cpanelUser_dbUser" required />
            </div>
            <div>
                <label>Database Password</label>
                <input type="password" name="db_pass" placeholder="Your MySQL Password" />
            </div>
            <button type="submit">⚡ Setup Database Now</button>
        </form>
    </div>
</body>
</html>
