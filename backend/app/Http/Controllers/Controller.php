<?php

namespace App\Http\Controllers;

use App\Models\SupportTopic;

abstract class Controller
{
    public function topics()
    {
        return response()->json(
            SupportTopic::select('id', 'label')->get()
        );
    }
}
