//Constants
const csvPath = "./data.csv"    //CSV from Google Sheets
const audioPath = "./audio"     //Path where audio files are located
const deleteUnknown = false     //Delete the files that don't have names in the CSV?
const trackName = 'Track'       //Name of the column containing the Offset IDs/filenames
const titleName = 'Title'       //Name of the column containing the Song Titles
const outputExtension = '.ogg'  //Extension of the audio files being sorted
const maxLength = 55            //Maximum number of characters allowed in a song title

//Dependencies
const parse = require('csv-parse/lib/sync')
var fs = require('fs')

//Load CSV File
let csv = fs.readFileSync(csvPath, {encoding:'utf8', flag:'r'})

//The spreadsheet currently has a header line; "Might not be accurate. Please correct if more information is found"
//Delete that and treat the rest as CSV
let lines = csv.split('\n')
lines.splice(0, 1)
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
for (let record of records) {
  //Remove characters not safe for Windows paths, trim whitespace, truncate to maximum length and add extension
  let filename = record[titleName].replace(/[^() a-zA-Z0-9-_]/g, '').trim().substring(0, maxLength) + outputExtension
  let dupeCheck = records.find(prev => { return prev[titleName] === filename })
  if (dupeCheck) {
    //TODO: Improve duplicate name handling.
    console.log(`Found duplicate file name: ${dupeCheck[titleName]}. Appending \'0\'.`)
    record[titleName] = filename.replace('.ogg', '0.ogg')
  }
  else record[titleName] = filename
  record[trackName] = record[trackName] + outputExtension
}

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