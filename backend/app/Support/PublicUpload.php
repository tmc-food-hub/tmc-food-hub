<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

final class PublicUpload
{
    public static function store(UploadedFile $file, string $directory): string
    {
        $directory = trim(str_replace('\\', '/', $directory), '/');
        $targetDirectory = public_path('uploads/' . $directory);

        File::ensureDirectoryExists($targetDirectory);

        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'bin');
        $filename = Str::random(40) . '.' . $extension;

        $file->move($targetDirectory, $filename);

        return 'uploads/' . $directory . '/' . $filename;
    }

    public static function delete(?string $path): void
    {
        $normalized = MediaPath::normalizeStoredPath($path);

        if (!is_string($normalized) || $normalized === '') {
            return;
        }

        if (
            str_starts_with($normalized, 'data:')
            || preg_match('/^https?:\/\//i', $normalized)
        ) {
            return;
        }

        $relativePath = ltrim(str_replace('\\', '/', $normalized), '/');
        $fullPath = public_path($relativePath);

        if (is_file($fullPath)) {
            @unlink($fullPath);
        }
    }
}
