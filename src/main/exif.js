const ExifImage = require('exif').ExifImage
export function exif(file) {
  //const pathi = 'D:\\Маша Телефон\\DCIM\\Camera\\IMG_20230102_215428.jpg'
  //const pathi = 'D:\\IMG_20201231_235514.jpg'
  try {
    new ExifImage({ image: file }, function (error, exifData) {
      if (error) console.log('Error: ' + error.message)
      else console.log({make :exifData.image.Make, model: exifData.image.Model}) // Do something with your data!
    })
  } catch (error) {
    console.log('Error: ' + error.message)
  }
}
