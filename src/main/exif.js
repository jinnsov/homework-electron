const ExifImage = require('exif').ExifImage
export function exif4(file) {
  return new Promise((resolve, reject) => {
    new ExifImage({ image: file }, function (error, exifData) {
      if (error) {
        if (error.code === 'NO_EXIF_SEGMENT') {
          resolve({ make: 'Нет данных', model: 'Нет данных' })
        } else {
          reject(error)
        }
      } else {
        resolve({ make: exifData.image.Make, model: exifData.image.Model })
      }
    })
  })
}
