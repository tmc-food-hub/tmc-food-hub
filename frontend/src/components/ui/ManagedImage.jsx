import React, { useEffect, useMemo, useState } from 'react';
import { resolveMediaUrl } from '../../utils/media';

function normalizeCandidate(src) {
    if (!src || typeof src !== 'string') return '';
    return resolveMediaUrl(src.trim());
}

export default function ManagedImage({ sources = [], fallback = '', ...props }) {
    const resolvedSources = useMemo(() => {
        const candidates = [...sources, fallback]
            .map(normalizeCandidate)
            .filter(Boolean);

        return [...new Set(candidates)];
    }, [sources, fallback]);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [resolvedSources]);

    if (resolvedSources.length === 0) {
        return null;
    }

    return (
        <img
            {...props}
            src={resolvedSources[Math.min(activeIndex, resolvedSources.length - 1)]}
            onError={(event) => {
                if (activeIndex < resolvedSources.length - 1) {
                    setActiveIndex((current) => current + 1);
                    return;
                }

                props.onError?.(event);
            }}
        />
    );
}
