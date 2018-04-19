<?php
    $id = $_POST['id'];

    // check if we have an id
    if ($id != null) {
        // check if file exists 
        if(file_get_contents('https://domain.com/maps/' . $id . '.json')) {
            // return the json of the file
            $json = file_get_contents('https://domain.com/maps/' . $id . '.json');
            echo $json;
        } else {
            echo 'Error';
        }
    } else {
        echo 'Error';
    }
?>