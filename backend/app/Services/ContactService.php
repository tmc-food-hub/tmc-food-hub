<?php

namespace App\Services;

use App\Repositories\Interfaces\ContactRepositoryInterface;
use App\Mail\ContactFormSubmitted;
use App\Mail\ContactFormReceived;
use Illuminate\Support\Facades\Mail;

class ContactService
{
    private $contactRepository;

    public function __construct(ContactRepositoryInterface $contactRepository)
    {
        $this->contactRepository = $contactRepository;
    }

    public function getAllContacts()
    {
        return $this->contactRepository->all();
    }

    public function submitContact(array $data)
    {
         $data['name'] = strip_tags($data['name']);
        $data['email'] = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $data['subject'] = strip_tags($data['subject']);
        $data['message'] = strip_tags($data['message']);

         $contact = $this->contactRepository->create($data);

         Mail::to(config('mail.admin_email', 'comlabaccsys@gmail.com'))
            ->send(new ContactFormSubmitted($contact));

        /* Mail::to($contact->email)
            ->send(new ContactFormReceived($contact));*/

        return $contact;
    }

    public function getContactById($id)
    {
        return $this->contactRepository->find($id);
    }

    public function deleteContact($id)
    {
        return $this->contactRepository->delete($id);
    }
}