import {createElement, isValidElement} from 'react';

function hasElements(values) {
    let has = false;
    if (values) {
        Object.keys(values).forEach((name) => {
            let value = values[name];

            if (isValidElement(value)) {
                has = true; 
            }
        });
    }

    return has;
}

function formatTextMessage(tplString, values={}) {

    if (tplString) {

        for (var field in values) {
            if (values.hasOwnProperty(field)) {
                var value = values[field];
                var re = new RegExp('\\{\\s*' + field + '\\s*\\}', 'g');
                tplString = tplString.replace(re, value)
            }
        }
    }
    
    return tplString;

}



function formatCompositedMessage(tplString, values) {
    let tokenDelimiter, tokenizedValues, elements;

    if (!tplString) {
        return tplString;
    }

    let hasValues = values && Object.keys(values).length > 0;

    if (hasValues) {
        // Creates a token with a random UID that should not be guessable or
        //             // conflict with other parts of the `message` string.
        let uid = Math.floor(Math.random() * 0x10000000000).toString(16);

        let generateToken = (() => {
            let counter = 0;
            return () => `ELEMENT-${uid}-${counter += 1}`;
        })();


        // Splitting with a delimiter to support IE8. When using a regex
        //             // with a capture group IE8 does not include the capture group in
        //                         // the resulting array.
        tokenDelimiter  = `@__${uid}__@`;
        tokenizedValues = {};
        elements        = {};

        Object.keys(values).forEach((name) => {
            let value = values[name];

            if (isValidElement(value)) {
                let token = generateToken();
                tokenizedValues[name] = tokenDelimiter + token + tokenDelimiter;
                elements[token]       = value;
            } else {
                tokenizedValues[name] = value;
            }
        });


    }

    let formattedMessage = formatTextMessage(tplString, tokenizedValues || values);

    let nodes, retMessage;

    let hasElements = elements && Object.keys(elements).length > 0;
    if (hasElements) {
        let nodes;
        // Split the message into parts so the React Element values captured
        // above can be inserted back into the rendered message. This
        // approach allows messages to render with React Elements while
        // keeping React's virtual diffing working properly.

        nodes = formattedMessage
            .split(tokenDelimiter)
            .filter((part) => !!part)
            .map((part) => elements[part] || part);


        retMessage = createElement('span', null, ...nodes);
        


    }
    else {
        retMessage = formattedMessage;
    }

    return retMessage;



}


function formatMessage(messages, key,  values) {
    
    const tplString = messages && messages[key];

    let message = tplString;

    if (tplString) {

        if (hasElements(values)) {
            //return <FormatMessage tplString={tplString} values={values} />
            message = formatCompositedMessage(tplString, values);
        }
        else {
            message = formatTextMessage(tplString, values);
        }

    }
    else {
        console.warn('field is not translated, field key:[', key, ']' );
    }

    return message;
}



export {formatCompositedMessage, formatTextMessage, formatMessage};
