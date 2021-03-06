//Constants
const csvPath = "./data.csv"          //CSV from Google Sheets
const audioPath = "./audio"           //Path where audio files are located
const deleteUnknown = false           //Delete the files that don't have names in the CSV?
const trackName = '.wem File Name'    //Name of the column containing the Offset IDs/filenames
const titleName = 'Title'             //Name of the column containing the Song Titles
const outputExtension = '.ogg'        //Extension of the audio files being sorted
const maxLength = 128                 //Maximum number of characters allowed in a song title

//Dependencies
const parse = require('csv-parse/lib/sync')
var fs = require('fs')

//Load CSV File
let csv = fs.readFileSync(csvPath, {encoding:'utf8', flag:'r'})

//Deletes everything up to the header line
let lines = csv.split('\n')
lines.splice(0, 22)
csv = lines.join('\n')

//Extract Filenames
const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  cast: true,
  ltrim: true,
  rtrim: true,
  trim: true
})
let foundDupe = false
for (let record of records) {
  if (!record[titleName] && !record[trackName]) continue
  if (!record[titleName]) {
    console.log(`Track ${record[trackName]} does not have a title.`)
    continue
  }
  if (!record[trackName]) {
    console.log(`Track ${record[titleName]} does not have a WEM offset.`)
    continue
  }
  //Remove characters not safe for Windows paths, trim whitespace, truncate to maximum length and add extension
  let filename = record[titleName].replace(/[^() a-zA-Z0-9-_]/g, '').trim().substring(0, maxLength) + outputExtension
  let dupeCheck = records.find(prev => { return prev[titleName] === filename })
  if (dupeCheck) {
    //TODO: Improve duplicate name handling.
    foundDupe = true
    console.log(`Found duplicate file name: ${dupeCheck[titleName]}. Appending \'_0\'.`)
    record[titleName] = filename.replace('.ogg', '_0.ogg')
  }
  else record[titleName] = filename
  record[trackName] = record[trackName] + outputExtension
}
if (foundDupe) console.log('\n')

//Load and Parse Audio
filenames = fs.readdirSync(audioPath)
for (let file of filenames) {
  const fullPathFrom = audioPath + '/' + file
  record = records.find(record => { return file === record[trackName] })
  if (!record) {
    if (deleteUnknown) {
      console.log('Deleting', fullPathFrom)
      fs.unlinkSync(fullPathFrom)
    }
    continue
  }
  const fullPathTo = audioPath + '/' + record[titleName]
  console.log('Renaming', fullPathFrom, 'to', fullPathTo)
  if (!fs.existsSync(fullPathTo.substring(0, fullPathTo.lastIndexOf('/')))) fs.mkdirSync(fullPathTo.substring(0, fullPathTo.lastIndexOf('/')), { recursive: true })
  fs.renameSync(fullPathFrom, fullPathTo)
}