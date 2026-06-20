<?php
$conn = new mysqli("localhost", "root", "root", "smartpanel", 8889);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function update_option($conn, $name, $value) {
    $stmt = $conn->prepare("SELECT id FROM general_options WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $stmt = $conn->prepare("UPDATE general_options SET value = ? WHERE name = ?");
        $stmt->bind_param("ss", $value, $name);
    } else {
        $stmt = $conn->prepare("INSERT INTO general_options (name, value) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $value);
    }
    $stmt->execute();
}

update_option($conn, "social_login_google_enable", "1");
update_option($conn, "social_login_google_app_id", "224409684037-50aka61eob9ofic1krnnvjmlbv0do2ad.apps.googleusercontent.com");
update_option($conn, "social_login_google_secret_key", "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");

echo "Keys updated successfully!";
?>
