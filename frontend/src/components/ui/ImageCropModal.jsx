import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

const overlayStyle = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 9999, display: 'flex', flexDirection: 'column',
    fontFamily: "'Inter', sans-serif",
};
const headerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 1.5rem', backgroundColor: '#111827', color: '#fff',
};
const cropAreaStyle = { position: 'relative', flex: 1, background: '#000' };
const footerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1rem 1.5rem', backgroundColor: '#111827',
};
const sliderWrap = { display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '320px' };
const sliderStyle = { flex: 1, accentColor: '#991B1B', cursor: 'pointer' };
const btnCancel = {
    padding: '0.55rem 1.25rem', border: '1px solid #4b5563', borderRadius: '8px',
    background: 'transparent', color: '#d1d5db', fontWeight: 600, cursor: 'pointer',
    fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
};
const btnApply = {
    padding: '0.55rem 1.5rem', border: 'none', borderRadius: '8px',
    background: '#991B1B', color: '#fff', fontWeight: 700, cursor: 'pointer',
    fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
};

/**
 * @param {string}  imageSrc   – object URL of the selected image
 * @param {number}  aspect     – aspect ratio (e.g. 16/5 for cover, 1 for logo)
 * @param {string}  title      – modal title
 * @param {boolean} cropShape  – 'rect' or 'round'
 * @param {number}  outputWidth  – desired output width
 * @param {number}  outputHeight – desired output height
 * @param {(file: File) => void} onComplete – callback with the cropped File
 * @param {() => void}           onCancel
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
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
                <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Drag to reposition · Scroll to zoom</span>
            </div>

            <div style={cropAreaStyle}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    cropShape={cropShape}
                    showGrid={cropShape === 'rect'}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{
                        containerStyle: { background: '#000' },
                        cropAreaStyle: {
                            border: '2px solid rgba(255,255,255,0.6)',
                            borderRadius: cropShape === 'round' ? '50%' : '8px',
                        },
                    }}
                />
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
