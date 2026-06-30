import { ImagePlus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  createMediaItem,
  getGallery,
  maxImageSize,
  mediaCategories,
  normalizeImageValue,
  saveGallery,
  validateImageFile,
} from '../../lib/adminStore.js';

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function ImagePreview({ image, onRemove, onEdit, canRemove = true }) {
  if (!image?.src) {
    return (
      <div className="admin-image-empty">
        <ImagePlus size={22} />
        <span>Nenhuma imagem selecionada</span>
      </div>
    );
  }

  return (
    <div className="admin-image-preview">
      <img src={image.src} alt={image.alt || image.name || 'Imagem selecionada'} />
      <div>
        <strong>{image.name || image.alt || 'Imagem selecionada'}</strong>
        <span>{image.category || 'Sem categoria'}</span>
        {onEdit && (
          <div className="admin-image-meta-fields">
            <label>
              Nome amigável
              <input value={image.name || ''} onChange={(event) => onEdit('name', event.target.value)} />
            </label>
            <label>
              Alt text
              <textarea value={image.alt || ''} onChange={(event) => onEdit('alt', event.target.value)} />
            </label>
          </div>
        )}
      </div>
      {canRemove && (
        <button type="button" onClick={onRemove} aria-label="Remover imagem">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

export function ImagePicker({
  label,
  value,
  onChange,
  category = 'Outros',
  multiple = false,
  required = false,
  notice,
}) {
  const [open, setOpen] = useState(false);
  const [gallery, setGallery] = useState(getGallery);
  const [activeCategory, setActiveCategory] = useState(category);
  const [query, setQuery] = useState('');
  const [uploadError, setUploadError] = useState('');

  const selectedImages = useMemo(() => {
    if (multiple) return (Array.isArray(value) ? value : []).map(normalizeImageValue).filter(Boolean);
    return normalizeImageValue(value);
  }, [multiple, value]);

  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      const matchesCategory = activeCategory === 'Todas' || item.category === activeCategory;
      const text = `${item.name} ${item.alt} ${item.category}`.toLowerCase();
      return matchesCategory && text.includes(query.toLowerCase());
    });
  }, [activeCategory, gallery, query]);

  function persistGallery(nextGallery) {
    setGallery(nextGallery);
    saveGallery(nextGallery);
  }

  async function handleUpload(event) {
    const files = Array.from(event.target.files || []);
    const nextItems = [];

    for (const file of files) {
      const error = validateImageFile(file);
      if (error) {
        setUploadError(error);
        event.target.value = '';
        return;
      }
      const dataUrl = await readFileAsDataUrl(file);
      nextItems.push(createMediaItem({ file, dataUrl, category: activeCategory === 'Todas' ? category : activeCategory }));
    }

    if (nextItems.length) {
      persistGallery([...nextItems, ...gallery]);
      setUploadError('');
    }
    event.target.value = '';
  }

  function selectImage(image) {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const exists = current.some((item) => normalizeImageValue(item)?.src === image.src);
      onChange(exists ? current : [...current, image]);
      return;
    }

    onChange(image);
    setOpen(false);
  }

  function removeImage(image) {
    if (required) return;
    if (multiple) {
      onChange((Array.isArray(value) ? value : []).filter((item) => normalizeImageValue(item)?.src !== image.src));
      return;
    }
    onChange(null);
  }

  function editImage(image, field, nextValue) {
    if (!image) return;
    const nextImage = { ...image, [field]: nextValue };
    if (multiple) {
      onChange((Array.isArray(value) ? value : []).map((item) => (normalizeImageValue(item)?.src === image.src ? nextImage : item)));
      return;
    }
    onChange(nextImage);
  }

  function moveImage(index, direction) {
    if (!multiple) return;
    const current = Array.isArray(value) ? [...value] : [];
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= current.length) return;
    [current[index], current[nextIndex]] = [current[nextIndex], current[index]];
    onChange(current);
  }

  return (
    <div className="admin-image-picker">
      <div className="admin-image-picker-head">
        <span>{label}</span>
        <button type="button" className="admin-secondary" onClick={() => setOpen(true)}>
          {multiple ? 'Adicionar imagem' : 'Trocar imagem'}
        </button>
      </div>
      {notice && <p className={required ? 'admin-image-notice' : 'admin-gallery-notice'}>{notice}</p>}

      {multiple ? (
        <div className="admin-image-list-preview">
          {selectedImages.length ? (
            selectedImages.map((image, index) => (
              <div key={image.src} className="admin-image-sort-row">
                <ImagePreview image={image} onRemove={() => removeImage(image)} onEdit={(field, nextValue) => editImage(image, field, nextValue)} />
                <div className="admin-image-sort-actions">
                  <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                    Subir
                  </button>
                  <button type="button" onClick={() => moveImage(index, 1)} disabled={index === selectedImages.length - 1}>
                    Descer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <ImagePreview onRemove={() => {}} />
          )}
        </div>
      ) : (
        <ImagePreview
          image={selectedImages}
          onRemove={() => removeImage(selectedImages)}
          onEdit={(field, nextValue) => editImage(selectedImages, field, nextValue)}
          canRemove={!required}
        />
      )}

      {open && (
        <div className="admin-media-modal" role="dialog" aria-modal="true">
          <div className="admin-media-modal-card">
            <div className="admin-media-modal-head">
              <div>
                <p className="admin-mini-label">Biblioteca de mídia</p>
                <h2>Selecionar imagem</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar biblioteca">
                <X size={20} />
              </button>
            </div>

            <div className="admin-media-toolbar">
              <label>
                Categoria
                <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>
                  <option>Todas</option>
                  {mediaCategories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                Buscar
                <span>
                  <Search size={16} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, alt ou categoria" />
                </span>
              </label>
              <label className="admin-file-button">
                Upload JPG, PNG ou WEBP
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleUpload} />
              </label>
            </div>
            {uploadError && <p className="admin-error">Upload bloqueado: {uploadError}</p>}
            <p className="admin-media-help">Limite por arquivo: {Math.round(maxImageSize / 1024 / 1024)}MB.</p>

            <div className="admin-media-select-grid">
              {filteredGallery.map((image) => (
                <button key={image.id} type="button" onClick={() => selectImage(image)}>
                  <img src={image.src} alt={image.alt} />
                  <strong>{image.name}</strong>
                  <span>{image.category}</span>
                </button>
              ))}
              {!filteredGallery.length && <p className="admin-empty">Nenhuma imagem encontrada.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
