<?php
$filename = 'C:\new\htdocs\project1\countryBorders.geo.json';
$content = file_get_contents($filename);

if ($content === false) {
    echo "Error reading the file";
} else {
     
    echo json_encode($content);
}
?>
