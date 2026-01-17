const textCapitalizerAndSpacifier = (text: string): string => {
  const textArray = text.split("-");
  const capitalizedTextArray = [];
  for (let i = 0; i < textArray.length; i++) {
    const capitalizedText = `${textArray[i].charAt(0).toUpperCase()}${textArray[
      i
    ].substring(1)}`;
    capitalizedTextArray.push(capitalizedText);
  }
  text = capitalizedTextArray.join(" ");
  return text;
};

export default textCapitalizerAndSpacifier;
