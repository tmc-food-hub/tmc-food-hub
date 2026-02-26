<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; 
use App\Models\SupportRequest;


class SupportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'topic_id' => 'required|exists:support_topics,id',
            'message' => 'required|string',
            'attachment' => 'nullable|file|mimes:jpg,png,pdf|max:5120'
        ]);

        $filePath = null;

        if ($request->hasFile('attachment')) {
            $filePath = $request->file('attachment')
                                ->store('support_attachments', 'public');
        }

        SupportRequest::create([
            ...$validated,
            'attachment' => $filePath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Support request submitted successfully'
        ]);
    }
}
