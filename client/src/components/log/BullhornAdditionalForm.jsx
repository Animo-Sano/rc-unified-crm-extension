import DropdownList from '../dropdownList';
import React, { useState, useEffect } from 'react';

export default ({ additionalFormInfo, setSubmission, style }) => {
    const [additionalDropdownSelection, setAdditionalDropdownSelection] = useState('');

    useEffect(() => {
        additionalFormInfo.value = additionalFormInfo.value.sort((a, b) => a.title > b.title ? 1 : -1)
        chrome.storage.local.get({ bullhornDefaultActionCode: '' },
            (items => {
                if (items.bullhornDefaultActionCode && additionalFormInfo.value.some(i => i.title === items.bullhornDefaultActionCode)) {
                    setAdditionalDropdownSelection(items.bullhornDefaultActionCode);
                    setSubmission({ commentAction: items.bullhornDefaultActionCode })
                }
                else {
                    console.log(additionalFormInfo.value[0].id)
                    setAdditionalDropdownSelection(additionalFormInfo.value[0].id);
                    setSubmission({ commentAction: additionalFormInfo.value[0].id });
                }
            }));
    }, [])

    return (
        <DropdownList
            key='key'
            style={style}
            label={additionalFormInfo.label}
            selectionItems={additionalFormInfo.value.map(d => { return { value: d.id, display: d.title } })}
            presetSelection={additionalDropdownSelection}
            onSelected={(selection) => {
                setAdditionalDropdownSelection(selection);
                selection ? setSubmission({ commentAction: selection }) : setSubmission(null);
            }} />
    );
}