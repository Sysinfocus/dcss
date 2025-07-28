const initStyle = `
*{margin:0;padding:0;box-sizing:border-box;}
html,body{max-width:100dvw;max-height:100dvh;width:100%;height:100%;font-family:system-ui,sans-serif;font-size:16px}
input,textarea,select,option,button{font-family:inherit;font-size:inherit}
`;

const matchStyles = [
    ["b", "background"],
    ["c", "color"],
    ["d", "display"],
    ["g", "gap"],
    ["h", "height"],
    ["m", "margin"],
    ["o", "opacity"],
    ["p", "padding"],
    ["t", "transform"],
    ["w", "width"],

    ["ac", "align-content"],
    ["ai", "align-items"],
    ["as", "align-self"],
    ["bc", "background-color"],
    ["bd", "border"],
    ["br", "border-radius"],
    ["bz", "box-sizing"],
    ["bs", "background-size"],
    ["bw", "box-shadow"],
    ["cg", "column-gap"],
    ["cr", "cursor"],
    ['fd', 'flex-direction'],
    ["ff", "font-family"],
    ["fs", "font-size"],
    ["fw", "font-weight"],
    ["fp", "flex-wrap"],    
    ["jc", "justify-content"],
    ["js", "justify-self"],
    ["lh", "line-height"],
    ["ls", "letter-spacing"],
    ["lt", "list-style"],
    ["mt", "margin-top"],
    ["mb", "margin-bottom"],
    ["ml", "margin-left"],
    ["mr", "margin-right"],
    ["mx", "margin-inline"],
    ["my", "margin-block"],
    ["nh", "min-height"],
    ["nw", "min-width"],    
    ["of", "overflow"],    
    ["pt", "padding-top"],
    ["pb", "padding-bottom"],
    ["pe", "pointer-events"],
    ["pl", "padding-left"],
    ["pr", "padding-right"],
    ["px", "padding-inline"],
    ["py", "padding-block"],
    ["pc", "place-content"],
    ["pi", "place-items"],
    ["pn", "position"],
    ["rg", "row-gap"],
    ["ta", "text-align"],
    ["td", "text-decoration"],    
    ["to", "transform-origin"],
    ["ts", "text-shadow"],
    ["tt", "text-transform"],
    ["tw", "text-wrap"],
    ["us", "user-select"],
    ["ws", "white-space"],
    ["wg", "word-spacing"],
    ["xh", "max-height"],
    ["xw", "max-width"],

    ["gtc", "grid-template-columns"],
    ["gtr", "grid-template-rows"],
    ["trn", "transition"],
];

const valueStyles = [
    ['a', 'auto'],
    ['b', 'block'],
    ['c', 'center'],
    ['f', 'flex'],
    ['g', 'grid'],
    ['h', 'hidden'],
    ['j', 'justify'],
    ['l', 'left'],
    ['n', 'none'],
    ['p', 'pointer'],
    ['r', 'right'],
    ['u', 'unset'],

    ['1r', '1rem'],
    ['2r', '2rem'],
    ['3r', '3rem'],
    ['4r', '4rem'],

    ['fe', 'flex-end'],
    ['fs', 'flex-start'],
    ['nl', 'normal'],
    ['ic', 'italic'],
    ['uc', 'uppercase'],
    ['lc', 'lowercase'],
    ['ul', 'underline'],
    ['ol', 'overline'],
    ['lt', 'line-through'],
    ['sa', 'space-around'],
    ['sb', 'space-between'],
    ['se', 'space-evenly'],
    ['rl', 'relative'],
    ['ab', 'absolute'],
    ['sy', 'sticky'],
    ['fd', 'fixed'],
    ['bb', 'border-box'],
    ['cb', 'content-box'],
    ['lg', 'linear-gradient'],
    ['rg', 'radial-gradient'],
    ['cg', 'conic-gradient'],
    ['rw', 'row'],
    ['cm', 'column'],
    ['fc', 'fit-content'],
];

let styles = document.querySelector('style');
if (styles === null) {
    styles = document.createElement('style')
    styles.innerHTML = initStyle;
    document.head.appendChild(styles)
}

const formatValue = (input) => {
    if (input.indexOf('(') >= 0) {
        const part = input.split('(')[0]
        const vm = valueStyles.find(x => x[0] === part.trim()) ?? null;
        if (vm !== null) return input.replaceAll(part, vm[1]);
    } else {
        const vm = valueStyles.find(x => x[0] === input.trim()) ?? null;
        if (vm !== null) return input.replaceAll(input, vm[1]);
    }
    return input;
}

const parseDCss = (type, element) => {
    const clsValues = element.getAttribute(type)?.trim().split(';');
    if (clsValues.length === 0) return '';
    let style = element.getAttribute('style') ?? '';
    let spl = "";
    let output = {};
    let lastKey = '';
    clsValues.forEach(cv => {
        const cvs = cv.trim().split(':');
        let key = cvs[0], value = cvs[1];
        if (key.indexOf(' ') > 0) {
            const splKey = key.split(' ');
            key = splKey[1].trim();
            const result = matchStyles.filter(m => key === m[0] ? m : null)
            if (lastKey != splKey[0].trim()) spl = "";
            lastKey = splKey[0].trim();
            result.forEach(r => spl += `${r[1]}:${formatValue(value)};`);
            output[splKey[0].trim()] = spl;
        }
        else {
            const result = matchStyles.filter(m => key === m[0] ? m : null)
            result.forEach(r => style += `${r[1]}:${formatValue(value)};`);
            output[''] = style;
        }
    });
    return output;
}

const spl = ['', 'hover', 'focus', 'active', 'focus-within', 'focus-visible', '*dark'];

const applySM = (label = '', maxWidth = '') => {
    let hasContent = false;
    let mq = `\n@media screen and (min-width:${maxWidth}) {\n`;
    if (label === '') mq = '';
    else label = label + '-';
    const tab = label === '' ? '' : '\t';
    elements = document.querySelectorAll(`[${label}de]`);
    elements.forEach(element => {
        let result = parseDCss(`${label}de`, element);

        for (let r in spl) {
            const s = result[spl[r]];
            if (s === undefined) continue;
            if (spl[r] === "") {
                hasContent = true;
                mq += `${tab}${element.tagName.toLocaleLowerCase()}{${s.trim()}}\n`;
            }
            else if (spl[r].startsWith("*")) {
                hasContent = true;
                mq += `${tab}.${spl[r].replace('*', '')} ${element.tagName.toLocaleLowerCase()}{${s.trim()}}\n`;
            }
            else {
                hasContent = true;
                mq += `${tab}${element.tagName.toLocaleLowerCase()}:${spl[r]}{${s.trim()}}\n`;
            }
            element.removeAttribute(`${label}de`)
        }
    });

    elements = document.querySelectorAll(`[${label}ds]`);
    elements.forEach(element => {
        let result = parseDCss(`${label}ds`, element);
        const hasName = element.getAttribute('dc');

        for (let r in spl) {
            const s = result[spl[r]];
            if (s === undefined) continue;
            let style = element.getAttribute('style') ?? '';
            if (spl[r] === "") {
                if (hasName !== null) {
                    hasContent = true;
                    mq += `${tab}.${hasName}{${s.trim()}}\n`;
                    element.classList.add(hasName)
                }
                else {
                    style += `${s.trim()}`;
                }
            }
            else if (spl[r].startsWith("*")) {
                if (hasName !== null) {
                    hasContent = true;
                    mq += `${tab}.${spl[r].replace('*', '')} .${hasName}{${s.trim()}}\n`;
                    element.classList.add(hasName)
                }
            }
            else {
                if (hasName !== null) {
                    hasContent = true;
                    mq += `${tab}.${hasName}:${spl[r]}{${s.trim()}}\n`;
                    element.classList.add(hasName)
                }
                else {
                    style += `${s.trim()}`;
                }
            }
            element.setAttribute('style', style);
            element.removeAttribute(`${label}ds`)
        }
    });

    if (!hasContent) return;

    const finalStyles = document.querySelector('style');
    if (finalStyles === null) {
        finalStyles = document.createElement('style');
        document.head.appendChild(finalStyles);
    }
    if (label === '') finalStyles.textContent += mq;
    else finalStyles.textContent += mq + `}`;
}

applySM();
applySM('xs', '375px');
applySM('sm', '640px');
applySM('md', '768px');
applySM('lg', '1024px');
applySM('xl', '1280px');
applySM('xxl', '1536px');

document.querySelectorAll('[de]').forEach(x => x.removeAttribute('de'));
document.querySelectorAll('[dc]').forEach(x => x.removeAttribute('dc'));
document.querySelectorAll('[ds]').forEach(x => x.removeAttribute('ds'));