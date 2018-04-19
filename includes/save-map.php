<?php
    $object = $_POST['object'];

    // check if we successfully got the object
    if ($object != null) {
        // open the tracker text file
        // and get our current value
        $tracker = intval(file_get_contents('../maps/tracker.txt'));
        $trackerNum = ++$tracker;
        file_put_contents('../maps/tracker.txt', $trackerNum);
        // save our current map data
        // into a file
        $file = fopen('../maps/' . $trackerNum . '.json','w');
        fwrite($file, $object);
        fclose($file);   
        echo $trackerNum;
    } else {
        echo 'Error';
    }
?>