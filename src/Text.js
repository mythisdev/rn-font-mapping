import {Text as RNText, StyleSheet} from 'react-native';
import React from 'react';
import get from 'lodash.get';

const getFontType = (fontStyleDict, targetWeight) => {
	if(isNaN(targetWeight)) {
		if(targetWeight == "normal") {
			targetWeight = 400;
		} else if(targetWeight == "bold") {
			targetWeight = 700;
		} else {
			console.warn(`Unknown font weight: ${targetWeight}, fallback to normal(400).`);
			targetWeight = 400;
		}
	}
	if(!!fontStyleDict[targetWeight]) {
		return fontStyleDict[targetWeight];
	} else {
		//Find closest weight
		targetWeight = parseInt(targetWeight);
		const keys = Object.keys(fontStyleDict).map(k => parseInt(k)).sort();
		targetWeight = keys.reduce(function(prev, curr) {
			return (Math.abs(curr - targetWeight) < Math.abs(prev - targetWeight) ? curr : prev);
		});
		return fontStyleDict[targetWeight];
	}
}

const getCustomFontFamilyStyles = (fontFamilyName, customFontsMapping, style = {}) => {
	const fontStyle = style.fontStyle || 'normal';
	const fontWeight = style.fontWeight || '400';
	if (style.fontFamily) {
		fontFamilyName = style.fontFamily;
	}

	let fontFamily = fontFamilyName;
	if(!!customFontsMapping && !!customFontsMapping[fontFamily]) {
		let dict = get(customFontsMapping[fontFamily]["fontWeights"], fontStyle);
		if(dict && Object.keys(dict).length > 0) {
			//Font Style exists
			fontFamilyName = getFontType(dict, fontWeight);
		} else if(fontStyle === 'italic'){
			//fallback to normal
			dict = get(customFontsMapping[fontFamily]["fontWeights"], 'normal');
			if(dict && Object.keys(dict).length > 0) {
				fontFamilyName = getFontType(dict, fontWeight);
			}
		}
	}
	fontFamily = fontFamilyName;

	return {
		fontFamily: fontFamily,
		fontWeight: fontWeight,
		fontStyle: fontStyle
	};
};

const Text =  ({style ,...others}) => {
    let newStyle = StyleSheet.flatten(style);
    return <RNText {...others} style={newStyle}/>
}

export {
    Text,
    getFontType,
    getCustomFontFamilyStyles
}