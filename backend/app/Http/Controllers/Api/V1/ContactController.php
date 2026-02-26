<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Resources\ContactResource;
use App\Services\ContactService;
use Illuminate\Http\Request;  

class ContactController extends Controller
{
    private $contactService;

    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }

    /**
     * Display a listing of the contacts (for admin).
     */
    public function index()
    {
         $contacts = $this->contactService->getAllContacts();
        return ContactResource::collection($contacts);
    }

    /**
     * Store a new contact (for client/user).
     */
    public function store(StoreContactRequest $request)
    {
        $contact = $this->contactService->submitContact($request->validated());
        
        return response()->json([
            'success' => true,
            'message' => 'Thank you for contacting us! We will get back to you soon.',
            'data' => new ContactResource($contact)
        ], 201);
    }

    /**
     * Display the specified contact.
     */
    public function show($id)
    {
         $contact = $this->contactService->getContactById($id);
        return new ContactResource($contact);
    }

    /**
     * Remove the specified contact.
     */
    public function destroy($id)
    {
        $this->contactService->deleteContact($id);
        return response()->json([
            'success' => true,
            'message' => 'Contact deleted successfully.'
        ], 200);
    }
}