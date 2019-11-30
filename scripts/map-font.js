const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

var currentPath = process.cwd();
const fontsPath = path.join(currentPath, 'assets', 'fonts');

const filenames = fs.readdirSync(fontsPath);
const fontFormats = [ '.ttf', '.otf' ];

/*
100 - Thin
200 - Extra Light, Ultra Light
300 - Light
400 - Normal, Book, Regular
500 - Medium
600 - Semi Bold, Demi Bold
700 - Bold
800 - Extra Bold, Ultra Bold
900 - Black, Heavy
*/
const fontWeightsMapping = {
    'Thin': 100,
    'ExtraLight': 200,
    'UltraLight': 200,
    'Light': 300,
    'Normal': 400,
    'Book': 400,
    'Regular': 400,
    'Medium': 500,
    'SemiBold': 600,
    'DemiBold': 600,
    'Bold': 700,
    'ExtraBold': 800,
    'UltraBold': 800,
    'Black': 900,
    'Heavy': 900
}

const basicFontFamilyObject = {
	fontFamily: '',
	fontWeights: {
        normal: {},
        italic: {}
	}
};

let customFonts = {};

for (var i = 0; i < filenames.length; i++) {
    let filename = filenames[i]

	const extension = path.extname(filename);

	if (!fontFormats.includes(extension)) {
		continue;
	}

	const fontPath = path.join(fontsPath, filename);
    const font = opentype.loadSync(fontPath);
    
    const postScriptName = font.names.postScriptName.en;
    let [fontFamily,fontWeightStyle]  = postScriptName.split("-");
    fontFamily = font.names.preferredFamily ? font.names.preferredFamily.en : font.names.fontFamily.en;

    //Rename font file
	const newFilename = postScriptName + extension;
	const newFontPath = path.join(fontsPath, newFilename);

	const relativeFontPath = path.relative(__dirname, fontPath);
	const relativeNewFontPath = path.relative(__dirname, newFontPath);

	if (filename === newFilename) {
		console.log(`${relativeFontPath} is already named correctly.`);
	} else {
		fs.renameSync(fontPath, newFontPath);
		console.log(`Renamed ${relativeFontPath} to ${relativeNewFontPath}.`);
    }

    //Add CustomFonts
    const isItalic = fontWeightStyle.toLowerCase().includes("italic");
    const fontWeightDictKey = isItalic ? "italic" : "normal";
    let fontWeight = fontWeightStyle.replace(/italic/ig, "");
    if(fontWeight.length == 0) {
        fontWeight = 'Normal';
    }


    const oldObj = customFonts[fontFamily] || {...basicFontFamilyObject};

    customFonts[fontFamily] = {
        ...oldObj,
        fontFamily: fontFamily,
        fontWeights: {
            ...oldObj.fontWeights,
            [fontWeightDictKey] : {
                ...oldObj.fontWeights[fontWeightDictKey],
                [fontWeightsMapping[fontWeight]]: postScriptName
            }            
        }
    }
}

const targetPath = path.join(currentPath, 'custom-fonts.json');
fs.writeFileSync(targetPath, JSON.stringify(customFonts) , 'utf-8');
console.dir(`Saved config json to: ${targetPath}`);
