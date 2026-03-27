<?php

namespace App\Support;

final class MediaPath
{
    public static function normalizeStoredPath(mixed $value): mixed
    {
        if (!is_string($value)) {
            return $value;
        }

        $value = trim($value);

        if ($value === '' || str_starts_with($value, 'data:') || str_starts_with($value, 'blob:')) {
            return $value;
        }

        if (str_starts_with($value, '//')) {
            $scheme = request()?->getScheme() ?: 'https';
            return $scheme . ':' . $value;
        }

        if (self::isAbsoluteUrl($value)) {
            $path = parse_url($value, PHP_URL_PATH);

            if (!is_string($path) || $path === '') {
                return $value;
            }

            if (self::isManagedMediaPath($path)) {
                return self::normalizeManagedPath($path);
            }

            return $value;
        }

        if (self::isAssetPath($value)) {
            return '/' . ltrim($value, '/');
        }

        if (self::isManagedMediaPath($value)) {
            return self::normalizeManagedPath($value);
        }

        if (str_starts_with($value, '/')) {
            return $value;
        }

        return ltrim($value, '/');
    }

    public static function toPublicUrl(mixed $value): mixed
    {
        if (!is_string($value)) {
            return $value;
        }

        $value = trim($value);

        if ($value === '' || str_starts_with($value, 'data:') || str_starts_with($value, 'blob:')) {
            return $value;
        }

        if (str_starts_with($value, '//')) {
            $scheme = request()?->getScheme() ?: 'https';
            return $scheme . ':' . $value;
        }

        if (self::isAssetPath($value)) {
            return '/' . ltrim($value, '/');
        }

        if (self::isAbsoluteUrl($value)) {
            $path = parse_url($value, PHP_URL_PATH);

            if (!is_string($path) || !self::isManagedMediaPath($path)) {
                return $value;
            }
        }

        $normalized = self::normalizeStoredPath($value);

        if (!is_string($normalized) || $normalized === '') {
            return $value;
        }

        if (self::isAssetPath($normalized)) {
            return '/' . ltrim($normalized, '/');
        }

        if (self::isAbsoluteUrl($normalized)) {
            return $normalized;
        }

        if (str_starts_with($normalized, '/')) {
            return url($normalized);
        }

        return self::buildMediaUrl($normalized);
    }

    private static function isAbsoluteUrl(string $value): bool
    {
        return preg_match('/^https?:\/\//i', $value) === 1;
    }

    private static function isAssetPath(string $path): bool
    {
        return str_starts_with(ltrim($path, '/'), 'assets/');
    }

    private static function isManagedMediaPath(string $path): bool
    {
        $path = ltrim(rawurldecode($path), '/');

        return str_starts_with($path, 'storage/')
            || str_starts_with($path, 'api/media/');
    }

    private static function normalizeManagedPath(string $path): string
    {
        $path = ltrim(rawurldecode(trim($path)), '/');

        if (str_starts_with($path, 'api/media/')) {
            $path = substr($path, strlen('api/media/'));
        }

        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, strlen('storage/'));
        }

        return ltrim($path, '/');
    }

    private static function buildMediaUrl(string $path): string
    {
        $encoded = implode('/', array_map('rawurlencode', explode('/', ltrim($path, '/'))));

        return url('/api/media/' . $encoded);
    }
}
