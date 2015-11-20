<?php

include_once 'rb.php';

R::setup('sqlite:book_list.sqlite'); //sqlite
R::setAutoResolve( TRUE );        //Recommended as of version 4.2