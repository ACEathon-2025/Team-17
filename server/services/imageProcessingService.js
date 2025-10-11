import sharp from 'sharp'
import * as tf from '@tensorflow/tfjs'

class ImageProcessingService {
  /**
   * Preprocess uploaded image for AI analysis
   */
  async preprocessImage(imagePath, targetSize = 224) {
    try {
      // Read and process image with sharp
      const imageBuffer = await sharp(imagePath)
        .grayscale()
        .resize(targetSize, targetSize, {
          fit: 'cover',
          position: 'center'
        })
        .removeAlpha()
        .raw()
        .toBuffer()

      // Convert to TensorFlow tensor
      const tensor = tf.tensor3d(
        new Uint8Array(imageBuffer),
        [targetSize, targetSize, 1]
      )

      // Normalize to 0-1 range
      const normalized = tensor.div(255.0)

      // Add batch dimension
      const batched = normalized.expandDims(0)

      // Clean up intermediate tensors
      tensor.dispose()
      normalized.dispose()

      return batched
    } catch (error) {
      console.error('Image preprocessing error:', error)
      throw new Error('Failed to process image')
    }
  }

  /**
   * Extract visual features from handwriting
   */
  async extractFeatures(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata()
      const stats = await sharp(imagePath).stats()

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        brightness: stats.channels[0]?.mean || 0,
        contrast: stats.channels[0]?.stdev || 0
      }
    } catch (error) {
      console.error('Feature extraction error:', error)
      return null
    }
  }

  /**
   * Cleanup tensor memory
   */
  disposeTensor(tensor) {
    if (tensor) {
      tensor.dispose()
    }
  }
}

export default new ImageProcessingService()
