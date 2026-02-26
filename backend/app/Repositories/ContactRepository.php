<?php

namespace App\Repositories;

use App\Models\Contact;
use App\Repositories\Interfaces\ContactRepositoryInterface;

class ContactRepository implements ContactRepositoryInterface
{
     public function all()
    {
        return Contact::latest()->get();
    }

     public function create(array $data)
    {
        return Contact::create($data);
    }

     public function find($id)
    {
        return Contact::findOrFail($id);
    }

     public function update($id, array $data)
    {
        $contact = $this->find($id);
        $contact->update($data);
        return $contact;
    }

     public function delete($id)
    {
        $contact = $this->find($id);
        return $contact->delete();
    }
}
