<?php
    header('Content-Type: application/json');

    $host = "localhost";
    $user = "root";
    $password = ""; 
    $dbname = "flowers_shop";

    $conn = new mysqli($host, $user, $password, $dbname);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Ошибка подключения к базе"]);
        exit();
    }

    $sql = "SELECT * FROM products";
    $result = $conn->query($sql);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products);

    $conn->close();
?>
