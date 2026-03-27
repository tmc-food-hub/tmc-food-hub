<?php

namespace App\Http\Controllers;

use App\Support\MediaPath;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function show(string $path)
    {
        $path = MediaPath::normalizeStoredPath($path);

        if (!is_string($path) || $path === '' || str_contains($path, '..')) {
            abort(404);
        }

        $resolvedPath = $this->resolveExistingPath($path);

        if ($resolvedPath === null) {
            abort(404);
        }

        return Storage::disk('public')->response($resolvedPath, null, [
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }

    private function resolveExistingPath(string $path): ?string
    {
        $disk = Storage::disk('public');
        $candidates = [$path];

        // Support legacy production records that stored only the filename
        // while the file itself lives under a media subdirectory.
        if (!str_contains($path, '/')) {
            $candidates = array_merge($candidates, [
                'restaurants/logos/' . $path,
                'restaurants/covers/' . $path,
                'menu_items/' . $path,
                'reviews/' . $path,
            ]);
        }

        foreach (array_unique($candidates) as $candidate) {
            if ($disk->exists($candidate)) {
                return $candidate;
            }
        }

        return null;
    }
}
