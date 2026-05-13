<?php
/**
 * Script de envío de formulario para TLC Detailing
 * Configurado para el servidor IONOS del cliente.
 */

// Descomenta la siguiente línea para depuración (solo en desarrollo)
// error_reporting(E_ALL); ini_set('display_errors', 1);

header('Content-Type: application/json');

// Recoger variables (Configuración manual)
$to_email  = 'info@tintadolunacoche.com';
$smtp_user = 'info@tintadolunacoche.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    exit;
}

// 2. Recoger y desinfectar datos
$nombre   = isset($_POST['nombre']) ? htmlspecialchars(trim($_POST['nombre'])) : '';
$email    = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$marca    = isset($_POST['marca']) ? htmlspecialchars(trim($_POST['marca'])) : '';
$modelo   = isset($_POST['modelo']) ? htmlspecialchars(trim($_POST['modelo'])) : '';
$anio     = isset($_POST['anio']) ? htmlspecialchars(trim($_POST['anio'])) : '';
$telefono = isset($_POST['telefono']) ? htmlspecialchars(trim($_POST['telefono'])) : '';

// Validación básica
if (empty($nombre) || empty($email) || empty($telefono)) {
    echo json_encode(['status' => 'error', 'message' => 'Por favor, rellena los campos obligatorios (Nombre, Email y Teléfono).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'El correo electrónico no es válido.']);
    exit;
}

// 3. Construir el mensaje (HTML para mejor legibilidad)
$subject = "Nueva solicitud de cita: $nombre";

$message = "<html><body>";
$message .= "<h2>Nueva solicitud de cita desde la web</h2>";
$message .= "<p><strong>Nombre:</strong> $nombre</p>";
$message .= "<p><strong>Email:</strong> $email</p>";
$message .= "<p><strong>Teléfono:</strong> $telefono</p>";
$message .= "<p><strong>Coche:</strong> $marca $modelo " . ($anio ? "($anio)" : "") . "</p>";
$message .= "<hr>";
$message .= "<p>Este mensaje ha sido enviado desde el formulario de contacto de TLC Detailing.</p>";
$message .= "</body></html>";

// 4. Cabeceras para correo HTML
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: TLC Detailing <$smtp_user>" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'includes/PHPMailer/Exception.php';
require 'includes/PHPMailer/PHPMailer.php';
require 'includes/PHPMailer/SMTP.php';

$mail = new PHPMailer(true);

try {
    // Configuración del Servidor
    $mail->isSMTP();
    $mail->Host       = 'smtp.ionos.es';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@tintadolunacoche.com';
    $mail->Password   = '4dT+YGd@~mRKHFX';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    // Destinatarios
    $mail->setFrom($smtp_user, 'TLC Detailing Web');
    $mail->addAddress($to_email);
    $mail->addReplyTo($email, $nombre);

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $message;
    $mail->AltBody = strip_tags(str_replace(['<p>', '</p>', '<br>'], ["\n", "\n", "\n"], $message));

    if ($mail->send()) {
        echo json_encode(['status' => 'success', 'message' => '¡Tu cita ha sido solicitada correctamente! Te contactaremos pronto.']);
    }
} catch (Exception $e) {
    // En producción, es mejor no mostrar el error detallado al usuario final, 
    // pero lo dejamos aquí para que el cliente pueda ver qué falla inicialmente.
    echo json_encode(['status' => 'error', 'message' => 'Error al enviar el correo: ' . $mail->ErrorInfo . '. Por favor, contacta por teléfono: +34 635 38 82 98']);
}
?>
