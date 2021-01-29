# Audio Sorter (Cyberpunk 2077)

A really dumb JS project to rename .ogg files exported from Cyberpunk 2077 according to the excellent Google Sheet made by **inuvivo**.

Link to the Google Sheet: [Cyberpunk 2077 Soundtrack Gamerip catalogue (Public)](https://docs.google.com/spreadsheets/d/1pNKW5u_1p33EKlWUDu5c3s9L1pFu1c0xDnH1kL8EZeY/edit#gid=0)

## Installation & Usage

1. Download and install the latest version of Node.
2. Download this project.
3. From the project folder, run the command `npm install` to download dependencies.
4. Copy all of the .ogg audio files extracted from Cyberpunk 2077 into the *./audio* folder of this project.
5. Go to to the spreadsheet linked above. Select *File>Download>Comma-seperated values*, and save the file as *data.csv* in the project folder.
6. Verify the settings at the top of the `index.js` file.
7. Run the command `npm start`.

## Contributing

Pull requests are welcome, but I probably won't be watching them.

## License

[WTFPL](http://www.wtfpl.net/)
