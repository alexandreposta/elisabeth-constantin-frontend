export function getCloudinaryThumbnail(url, { width = 600, quality = 'auto', format = 'auto' } = {}) {
  if (!url || typeof url !== 'string') return url;
  try {
    // Match Cloudinary upload URLs and inject a transformation
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;
    const prefix = url.slice(0, uploadIndex + 8);
    const suffix = url.slice(uploadIndex + 8);
    const transform = `f_${format},q_${quality},w_${width}`;
    return `${prefix}${transform}/${suffix}`;
  } catch (e) {
    return url;
  }
}

export function getThumbnailFallback(mainImage, thumbnailFromApi) {
  if (thumbnailFromApi) return thumbnailFromApi;
  return getCloudinaryThumbnail(mainImage);
}
