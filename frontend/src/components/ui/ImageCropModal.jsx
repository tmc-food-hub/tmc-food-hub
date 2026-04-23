import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

const overlayStyle = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 9999, display: 'flex', flexDirection: 'column',
    fontFamily: "'Inter', sans-serif",
};
const headerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.85rem 1.5rem', backgroundColor: '#111827', color: '#fff',
    borderBottom: '1px solid #1f2937', flexShrink: 0,
};
const cropAreaStyle = { position: 'relative', flex: 1, background: '#000', overflow: 'hidden' };
const footerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.85rem 1.5rem', backgroundColor: '#111827',
    borderTop: '1px solid #1f2937', flexShrink: 0,
};
const sliderWrap = { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '360px' };
const sliderStyle = { flex: 1, accentColor: '#991B1B', cursor: 'pointer', height: '4px' };
const btnCancel = {
    padding: '0.55rem 1.25rem', border: '1px solid #4b5563', borderRadius: '8px',
    background: 'transparent', color: '#d1d5db', fontWeight: 600, cursor: 'pointer',
    fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
    transition: 'all 0.15s',
};
const btnApply = {
    padding: '0.55rem 1.5rem', border: 'none', borderRadius: '8px',
    background: '#991B1B', color: '#fff', fontWeight: 700, cursor: 'pointer',
    fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
    transition: 'all 0.15s',
};

/**
 * Facebook-style image crop modal.
 * For cover images: crop area fills the full width of the viewport.
 * For logos: crop area is a large centered circle.
 */
export default function ImageCropModal({
    imageSrc,
    aspect = 16 / 5,
    title = 'Crop Image',
    cropShape = 'rect',
    outputWidth = 1600,
    outputHeight = 500,
    onComplete,
    onCancel,
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [applying, setApplying] = useState(false);
    const [cropSize, setCropSize] = useState(null);
    const containerRef = useRef(null);

    // Calculate crop size to fill the container width (like Facebook)
    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;
            const containerW = containerRef.current.clientWidth;
            const containerH = containerRef.current.clientHeight;

            if (cropShape === 'round') {
                // Logo: large centered circle
                const diameter = Math.min(containerW, containerH) * 0.65;
                setCropSize({ width: Math.round(diameter), height: Math.round(diameter) });
            } else {
                // Cover: fill the full width, height follows aspect ratio
                const padX = 40; // small horizontal padding
                const cropW = containerW - padX;
                const cropH = cropW / aspect;
                // If crop is taller than container, scale down
                if (cropH > containerH * 0.85) {
                    const scaledH = containerH * 0.85;
                    const scaledW = scaledH * aspect;
                    setCropSize({ width: Math.round(scaledW), height: Math.round(scaledH) });
                } else {
                    setCropSize({ width: Math.round(cropW), height: Math.round(cropH) });
                }
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [aspect, cropShape]);

    const onCropComplete = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleApply = async () => {
        if (!croppedAreaPixels) return;
        setApplying(true);
        try {
            const blob = await getCroppedImg(imageSrc, croppedAreaPixels, outputWidth, outputHeight);
            const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg', lastModified: Date.now() });
            onComplete(file);
        } catch (err) {
            console.error('Crop failed:', err);
        } finally {
            setApplying(false);
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={headerStyle}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{title}</h3>
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Drag to reposition · Scroll to zoom</span>
            </div>

            <div ref={containerRef} style={cropAreaStyle}>
                {cropSize && (
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape={cropShape}
                        cropSize={cropSize}
                        showGrid={cropShape === 'rect'}
                        objectFit="horizontal-cover"
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        style={{
                            containerStyle: { background: '#000' },
                            cropAreaStyle: {
                                border: '3px solid rgba(255,255,255,0.8)',
                                borderRadius: cropShape === 'round' ? '50%' : '4px',
                                boxShadow: cropShape === 'rect'
                                    ? '0 0 0 9999px rgba(0,0,0,0.6)'
                                    : '0 0 0 9999px rgba(0,0,0,0.65)',
                            },
                            mediaStyle: {},
                        }}
                    />
                )}
            </div>

            <div style={footerStyle}>
                <div style={sliderWrap}>
                    <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap' }}>Zoom</span>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        style={sliderStyle}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600, minWidth: '32px' }}>{zoom.toFixed(1)}x</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={btnCancel} onClick={onCancel}>Cancel</button>
                    <button style={{ ...btnApply, opacity: applying ? 0.7 : 1 }} onClick={handleApply} disabled={applying}>
                        {applying ? 'Applying...' : 'Apply Crop'}
                    </button>
                </div>
            </div>
        </div>
    );
}
