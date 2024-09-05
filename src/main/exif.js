const ExifImage = require('exif').ExifImage
export async function exif(file) {
  //const pathi = 'D:\\Маша Телефон\\DCIM\\Camera\\IMG_20230102_215428.jpg'
  //const pathi = 'D:\\IMG_20201231_235514.jpg'
  let ret = {}
  try {
    new ExifImage(
      { image: file.path + '\\' + file.name },
      await function ext(error, exifData) {
        if (error) console.log('Error: ' + error.message)
        else {
          console.log({ make: exifData.image.Make, model: exifData.image.Model })
          //ret = { make: exifData.image.Make, model: exifData.image.Model }
        } // Do something with your data!
      }
    )
  } catch (error) {
    console.log('Error: ' + error.message)
  }
  return ret
}

export async function exif3(file) {
  return await new Promise((resolve, reject) => {
    new ExifImage({ image: file.path + '\\' + file.name }, function (error, exifData) {
      if (error) {
        if (error.code === 'NO_EXIF_SEGMENT') {
          resolve(JSON.stringify({ make: 'Нет данных', model: 'Нет данных' }))
        } else {
          reject(error)
        }
      } else {
        resolve(JSON.stringify({ make: exifData.image.Make, model: exifData.image.Model }))
      }
    })
  })
}

export async function exif4(file) {
  return await new Promise((resolve, reject) => {
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

export function exif2(file) {
  return new Promise((resolve, reject) => {
    try {
      const exifImage = new ExifImage()
      exifImage.exifData({ image: file.path + '\\' + file.name }, function (error, data) {
        if (error) {
          if (error.code === 'NO_EXIF_SEGMENT') {
            resolve(null)
          } else {
            reject(error)
          }
        } else {
          resolve(data)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}
