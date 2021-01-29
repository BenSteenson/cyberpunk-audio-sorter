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
lines.splice(0,1)
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
for (let i = 0; i < records.length; i++) {
  records[i][titleName] = records[i][titleName].replace(/[^() a-zA-Z0-9-_]/g, '').trim().substring(0, maxLength) + outputExtension
  records[i].filename = records[i][trackName] + outputExtension
}

//Load and Parse Audio
filenames = fs.readdirSync(audioPath)
filenames.forEach(file => {
  const fullPathFrom = audioPath + '/' + file
  record = records.find(record => { return file === record.filename})
  if (!record) {
    if (!deleteUnknown) return true
    console.log('Deleting',fullPathFrom)
    fs.unlinkSync(fullPathFrom)
    return true
  }
  const fullPathTo = audioPath + '/' + record[titleName]
  console.log('Moving',fullPathFrom,fullPathTo)
  if (!fs.existsSync(fullPathTo.substring(0, fullPathTo.lastIndexOf('/')))) fs.mkdirSync(fullPathTo.substring(0, fullPathTo.lastIndexOf('/')), { recursive: true })
  fs.renameSync(fullPathFrom, fullPathTo)
})