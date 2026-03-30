<?php

namespace App\Http\Controllers;

use App\Support\MediaPath;
use Illuminate\Support\Facades\Log;
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
            return $this->missingImageResponse($path);
        }

        $disk = Storage::disk('public');

        $extension = strtolower(pathinfo($resolvedPath, PATHINFO_EXTENSION));
        $mimeType = match ($extension) {
            'jpeg', 'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'webp' => 'image/webp',
            default => 'application/octet-stream',
        };

        try {
            $contents = $disk->get($resolvedPath);
        } catch (\Throwable $exception) {
            Log::warning('Unable to read media file from public disk.', [
                'path' => $path,
                'resolved_path' => $resolvedPath,
                'error' => $exception->getMessage(),
            ]);

            return $this->missingImageResponse($path);
        }

        return response($contents, 200, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }

    private function resolveExistingPath(string $path): ?string
    {
        $disk = Storage::disk('public');
        $candidates = [$path];
        $basename = pathinfo($path, PATHINFO_BASENAME);

        if ($basename !== '') {
            $candidates = array_merge($candidates, [
                'restaurants/logos/' . $basename,
                'restaurants/covers/' . $basename,
                'menu_items/' . $basename,
                'reviews/' . $basename,
                'orders/receipts/' . $basename,
            ]);
        }

        foreach (array_unique($candidates) as $candidate) {
            try {
                $exists = $disk->exists($candidate);
            } catch (\Throwable $exception) {
                Log::warning('Unable to inspect media candidate on public disk.', [
                    'requested_path' => $path,
                    'candidate' => $candidate,
                    'error' => $exception->getMessage(),
                ]);
                continue;
            }

            if ($exists) {
                return $candidate;
            }
        }

        return null;
    }

    private function missingImageResponse(string $path)
    {
        $label = strtoupper(substr(pathinfo($path, PATHINFO_FILENAME), 0, 2) ?: 'NA');
        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Missing image">
  <rect width="160" height="160" rx="24" fill="#f3f4f6"/>
  <rect x="20" y="20" width="120" height="120" rx="18" fill="#e5e7eb"/>
  <circle cx="56" cy="60" r="12" fill="#d1d5db"/>
  <path d="M36 112l26-28 18 18 18-22 26 32H36z" fill="#cbd5e1"/>
  <text x="80" y="142" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#9ca3af">{$label}</text>
</svg>
SVG;

        return response($svg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'public, max-age=300',
        ]);
    }
}
