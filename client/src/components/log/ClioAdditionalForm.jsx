import { RcCheckbox } from '@ringcentral/juno';
import DropdownList from '../dropdownList';
import React, { useState, useEffect } from 'react';

export default ({ additionalFormInfo, setSubmission, style }) => {
    const [additionalDropdownSelection, setAdditionalDropdownSelection] = useState(additionalFormInfo.value[0].id);
    const [logTimeEntry, setLogTimeEntry] = useState(true);

    useEffect(() => {
        setSubmission({ matterId: additionalFormInfo.value[0].id, logTimeEntry })
    }, [])

    useEffect(() => {
        setSubmission({ matterId: additionalDropdownSelection, logTimeEntry });
    }, [logTimeEntry, additionalDropdownSelection])

    return (
        <div>
            <DropdownList
                key='key'
                style={style}
                label={additionalFormInfo.label}
                selectionItems={additionalFormInfo.value.map(d => { return { value: d.id, display: d.title } })}
                presetSelection={additionalDropdownSelection}
                onSelected={(selection) => {
                    setAdditionalDropdownSelection(selection);
                }} />
            <RcCheckbox
                label="Log time entry"
                defaultChecked={true}
                onChange={(event) => {
                    setLogTimeEntry(event.target.checked, logTimeEntry);
                }}
                disableRipple
            />
        </div>
    );
}