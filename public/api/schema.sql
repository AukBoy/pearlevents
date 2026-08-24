-- Zircon Host MySQL Database Schema for Surprise Drive

CREATE TABLE IF NOT EXISTS `bookings` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data (Initial 13 Notebook Records)
INSERT INTO `bookings` (`id`, `ref_no`, `booked_date`, `event_date`, `place`, `phone`, `time`, `items`, `full_amount`, `advance`, `extra_info`, `status`) VALUES
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
(13, '13', '2026-08-21', '2026-08-21', 'Malabadamulla / Malabe', '0767410697', '3:00 PM / 7:00 PM', 'Deco & Mascot', 23000.00, 5000.00, '673 Mascot + Photo frame (1 Year Birthday)', 'pending')
ON DUPLICATE KEY UPDATE `ref_no`=`ref_no`;
