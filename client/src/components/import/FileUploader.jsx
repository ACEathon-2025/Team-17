import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, File, Image, FileText, Book, Link as LinkIcon } from 'lucide-react'

const FileUploader = ({ onFileSelect, acceptedFormats, maxSize = 10 }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles[0].errors.map(e => e.message).join(', ')
      alert(`File rejected: ${errors}`)
      return
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: true
  })

  const getFormatIcon = (format) => {
    if (format.includes('image')) return <Image className="h-8 w-8" />
    if (format.includes('pdf')) return <FileText className="h-8 w-8" />
    if (format.includes('word')) return <File className="h-8 w-8" />
    if (format.includes('epub')) return <Book className="h-8 w-8" />
    return <File className="h-8 w-8" />
  }

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive && !isDragReject
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : isDragReject
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-primary-400'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ y: isDragActive ? -10 : 0 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="p-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full">
            <Upload className="h-12 w-12 text-white" />
          </div>

          {isDragActive ? (
            <div>
              <p className="text-xl font-bold text-primary-600 dyslexia-text mb-2">
                Drop your files here!
              </p>
              <p className="text-sm text-[var(--text-secondary)] dyslexia-text">
                Release to upload
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-bold text-[var(--text-primary)] dyslexia-text mb-2">
                Drag & Drop Files Here
              </p>
              <p className="text-sm text-[var(--text-secondary)] dyslexia-text mb-4">
                or click to browse
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {Object.keys(acceptedFormats).map((format, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg"
                  >
                    {getFormatIcon(format)}
                    <span className="text-xs text-[var(--text-secondary)] dyslexia-text">
                      {format.split('/')[1].toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[var(--text-secondary)] mt-4 dyslexia-text">
                Maximum file size: {maxSize}MB
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default FileUploader
