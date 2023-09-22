import React, { useEffect, useState } from 'react';

import { QuestionnairesView } from '@/components/dragNdrop'

export default function DragDrop() {
    const [questionnaires, setQuestionnaires] = useState([]);

    useEffect(() => {
        // Drag & Drop
        let prepareData = [];
        for (let i = 1, len = 7; i < len; i++) {
            prepareData.push({
                title: `Rows${i}`
            });
        }
        setQuestionnaires(prepareData);
    }, []);

    /**
     * Function to handle drag & drop questionnaires
     * @param event
     */
    const handleOnDrag = (event) => {
        setQuestionnaires(event.value);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='text-3xl font-bold'>DRAG AND DROP</h5>
                    <br />
                    <QuestionnairesView
                        questionnaires={questionnaires}
                        handleOnDrag={handleOnDrag}
                    />
                </div>
            </div>
        </div>
    )
}