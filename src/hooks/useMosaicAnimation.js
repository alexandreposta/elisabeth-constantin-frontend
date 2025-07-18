import { useState, useEffect, useCallback, useRef } from 'react';

export const useMosaicAnimation = (images, initialDelay = 500) => {
  const [mosaicLayout, setMosaicLayout] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const imagesRef = useRef(images);
  const initialDelayRef = useRef(initialDelay);
  const windowWidthRef = useRef(windowWidth);
  
  imagesRef.current = images;
  initialDelayRef.current = initialDelay;
  windowWidthRef.current = windowWidth;
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const preloadImages = (imageUrls) => {
    return Promise.all(
      imageUrls.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
      })
    );
  };

  const getImageDimensions = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        resolve({ width: 300, height: 300 });
      };
      img.src = src;
    });
  };

  const createRandomLayout = useCallback(async () => {
    const shuffled = [...imagesRef.current];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const containerWidth = windowWidthRef.current;
    const containerHeight = 700;
    const placedImages = [];
    const maxAttempts = 500;
    const margin = 15;
    
    const doOverlap = (rect1, rect2, marginValue = margin) => {
      return !(
        rect1.right + marginValue < rect2.left ||
        rect2.right + marginValue < rect1.left ||
        rect1.bottom + marginValue < rect2.top ||
        rect2.bottom + marginValue < rect1.top
      );
    };
    
    const imageDimensions = await Promise.all(
      shuffled.map(src => getImageDimensions(src))
    );
    
    const scaleFactors = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
    
    shuffled.forEach((imageSrc, index) => {
      let placed = false;
      const originalDims = imageDimensions[index];
      const maxWidth = 350;
      const maxHeight = 350;
      const ratio = Math.min(maxWidth / originalDims.width, maxHeight / originalDims.height);
      
      for (let scaleIndex = 0; scaleIndex < scaleFactors.length && !placed; scaleIndex++) {
        const scaleFactor = scaleFactors[scaleIndex] + Math.random() * 0.1;
        const finalWidth = Math.floor(originalDims.width * ratio * scaleFactor);
        const finalHeight = Math.floor(originalDims.height * ratio * scaleFactor);
        const minSize = 120;
        const width = Math.max(finalWidth, minSize);
        const height = Math.max(finalHeight, minSize);
        
        let attempts = 0;
        while (!placed && attempts < maxAttempts) {
          const x = Math.max(0, Math.random() * (containerWidth - width));
          const y = Math.max(0, Math.random() * (containerHeight - height));
          
          const newRect = {
            left: x,
            top: y,
            right: x + width,
            bottom: y + height
          };
          
          const hasCollision = placedImages.some(placedImg => 
            doOverlap(newRect, placedImg.rect, margin)
          );
          
          if (!hasCollision) {
            placedImages.push({
              src: imageSrc,
              id: index,
              x: x,
              y: y,
              width: width,
              height: height,
              opacity: 0,
              animationClass: '',
              rect: newRect
            });
            placed = true;
          }
          
          attempts++;
        }
      }
    });
    
    const unplacedImages = shuffled.filter((_, index) => 
      !placedImages.some(placed => placed.id === index)
    );
    
    if (unplacedImages.length > 0) {
      const gridSize = 30;
      const cols = Math.floor(containerWidth / gridSize);
      const rows = Math.floor(containerHeight / gridSize);
      
      unplacedImages.forEach((imageSrc) => {
        const originalIndex = shuffled.indexOf(imageSrc);
        const smallSizes = [80, 100, 120, 150];
        
        for (let sizeIndex = 0; sizeIndex < smallSizes.length; sizeIndex++) {
          const size = smallSizes[sizeIndex];
          let placed = false;
          
          for (let row = 0; row < rows && !placed; row++) {
            for (let col = 0; col < cols && !placed; col++) {
              const x = col * gridSize + Math.random() * gridSize;
              const y = row * gridSize + Math.random() * gridSize;
              
              const newRect = {
                left: x,
                top: y,
                right: x + size,
                bottom: y + size
              };
              
              const hasCollision = placedImages.some(placedImg => 
                doOverlap(newRect, placedImg.rect, margin)
              );
              
              if (!hasCollision) {
                placedImages.push({
                  src: imageSrc,
                  id: originalIndex,
                  x: x,
                  y: y,
                  width: size,
                  height: size,
                  opacity: 0,
                  animationClass: '',
                  rect: newRect
                });
                placed = true;
              }
            }
          }
          
          if (placed) break;
        }
      });
    }
    
    return placedImages;
  }, []);

  const animateImages = useCallback((layout) => {
    setIsAnimating(true);
    
    setMosaicLayout(prevLayout => 
      prevLayout.map(img => ({ 
        ...img, 
        opacity: 0,
        animationClass: 'animate-out'
      }))
    );
    
    setTimeout(() => {
      setMosaicLayout(layout);
      
      layout.forEach((img, index) => {
        setTimeout(() => {
          setMosaicLayout(prevLayout => 
            prevLayout.map((prevImg, prevIndex) => 
              prevIndex === index 
                ? { 
                    ...prevImg, 
                    opacity: 1,
                    animationClass: 'animate-in'
                  }
                : prevImg
            )
          );
        }, index * 300);
      });
      
      setTimeout(() => {
        setIsAnimating(false);
        setMosaicLayout(prevLayout => 
          prevLayout.map(img => ({ 
            ...img, 
            animationClass: ''
          }))
        );
      }, layout.length * 300 + 800);
    }, 300);
  }, []);

  const redistributeImages = useCallback(async () => {
    if (!isAnimating && imagesLoaded) {
      const newLayout = await createRandomLayout();
      animateImages(newLayout);
    }
  }, [isAnimating, imagesLoaded, createRandomLayout, animateImages]);

  useEffect(() => {
    if (initialized) return;
    
    setInitialized(true);
    
    const initializeMosaic = async () => {
      try {
        await preloadImages(imagesRef.current);
        setImagesLoaded(true);
        
        const initialLayout = await createRandomLayout();
        setMosaicLayout(initialLayout);
        
        setTimeout(() => {
          animateImages(initialLayout);
        }, initialDelayRef.current);
      } catch (error) {
        setImagesLoaded(true);
        const initialLayout = await createRandomLayout();
        setMosaicLayout(initialLayout);
        setTimeout(() => {
          animateImages(initialLayout);
        }, initialDelayRef.current);
      }
    };

    initializeMosaic();
  }, [initialized]);

  return {
    mosaicLayout,
    isAnimating,
    redistributeImages,
    imagesLoaded
  };
};
