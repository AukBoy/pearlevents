<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all bookings
        try {
            $stmt = $pdo->query("SELECT id, ref_no as refNo, booked_date as bookedDate, event_date as date, place, phone, time, items, full_amount as fullAmount, advance, extra_info as extraInfo, status FROM bookings ORDER BY event_date ASC, id ASC");
            $bookings = $stmt->fetchAll();
            
            // Format numbers correctly
            foreach ($bookings as &$b) {
                $b['id'] = (string)$b['id'];
                $b['fullAmount'] = (float)$b['fullAmount'];
                $b['advance'] = (float)$b['advance'];
            }
            
            echo json_encode($bookings);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Insert new booking
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON payload"]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO bookings (ref_no, booked_date, event_date, place, phone, time, items, full_amount, advance, extra_info, status) VALUES (:refNo, :bookedDate, :date, :place, :phone, :time, :items, :fullAmount, :advance, :extraInfo, :status)");
            
            $stmt->execute([
                ':refNo' => $data['refNo'] ?? '',
                ':bookedDate' => $data['bookedDate'] ?? date('Y-m-d'),
                ':date' => $data['date'] ?? date('Y-m-d'),
                ':place' => $data['place'] ?? '',
                ':phone' => $data['phone'] ?? '',
                ':time' => $data['time'] ?? '',
                ':items' => $data['items'] ?? '',
                ':fullAmount' => $data['fullAmount'] ?? 0,
                ':advance' => $data['advance'] ?? 0,
                ':extraInfo' => $data['extraInfo'] ?? '',
                ':status' => $data['status'] ?? 'pending'
            ]);

            $newId = $pdo->lastInsertId();
            echo json_encode(["success" => true, "id" => (string)$newId]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update booking
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $_GET['id'] ?? ($data['id'] ?? null);

        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing booking ID"]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("UPDATE bookings SET ref_no = :refNo, booked_date = :bookedDate, event_date = :date, place = :place, phone = :phone, time = :time, items = :items, full_amount = :fullAmount, advance = :advance, extra_info = :extraInfo, status = :status WHERE id = :id");
            
            $stmt->execute([
                ':id' => $id,
                ':refNo' => $data['refNo'] ?? '',
                ':bookedDate' => $data['bookedDate'] ?? date('Y-m-d'),
                ':date' => $data['date'] ?? date('Y-m-d'),
                ':place' => $data['place'] ?? '',
                ':phone' => $data['phone'] ?? '',
                ':time' => $data['time'] ?? '',
                ':items' => $data['items'] ?? '',
                ':fullAmount' => $data['fullAmount'] ?? 0,
                ':advance' => $data['advance'] ?? 0,
                ':extraInfo' => $data['extraInfo'] ?? '',
                ':status' => $data['status'] ?? 'pending'
            ]);

            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Delete booking
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing booking ID"]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method Not Allowed"]);
        break;
}
?>
