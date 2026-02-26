<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|filled|string|max:255',
            'email' => [
                'required',
                'filled',
                'email:rfc,dns',
                'max:255',
                function ($attribute, $value, $fail) {
                    $domain = substr(strrchr($value, "@"), 1);
                    
                    $blockedDomains = ['sample.com', 'test.com', 'example.com', 'fake.com'];
                    
                    if (in_array(strtolower($domain), $blockedDomains)) {
                        $fail('Please use a real email address. Test domains are not allowed.');
                    }
                }
            ],
            'subject' => 'required|filled|string|max:255',
            'message' => 'required|filled|string|max:5000',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Please enter your name',
            'name.filled' => 'Name cannot be empty',
            'email.required' => 'Please enter your email',
            'email.filled' => 'Email cannot be empty',
            'email.email' => 'Please enter a valid email address',
            'subject.required' => 'Please enter a subject',
            'subject.filled' => 'Subject cannot be empty',
            'message.required' => 'Please enter your message',
            'message.filled' => 'Message cannot be empty',
        ];
    }
}