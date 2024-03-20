import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Code } from '@nextui-org/react';

export default function CodeExecutionCell({ judge0_token }) {
    const [codeExeData, setCodeExeData] = useState('');
    const [isCodeRunning, setIsCodeRunning] = useState(false)
    const [codeExeStatus, setCodeExeStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCodeExe = async () => {
        setIsCodeRunning(true)
        try {
            const getStdoutResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${judge0_token}?base64_encoded=true&fields=*`, {
                headers: {
                    'X-RapidAPI-Key': import.meta.env.VITE_RapidAPI_KEY,
                    'X-RapidAPI-Host': import.meta.env.VITE_RapidAPI_URL
                }
            });
            const data = await getStdoutResponse.json();

            if (getStdoutResponse.ok) {
                if (!(data.status.description === 'Accepted')) {
                    setCodeExeStatus(false)
                    setCodeExeData(`${data.status.description} : ${atob(data.compile_output)}`);
                } else {
                    setCodeExeStatus(true)
                    setCodeExeData(atob(data.stdout));
                }
            }

        } catch (error) {
            console.error(`Error while getting stdout : ${error}`)
            setErrorMessage(error.message);
        }
        setIsCodeRunning(false)
    };

    return (
        <div className='min-w-max'>
            {codeExeData && <Code color={codeExeStatus ? 'secondary' : 'danger'}>{codeExeData}</Code>}
            {errorMessage && <p className='text-xs text-danger-400 font-light'>{errorMessage}</p>}
            {!codeExeData && <Button color="warning" variant="faded" size="sm" onClick={handleCodeExe} isLoading={isCodeRunning}>Run</Button>}
        </div>
    )
}

CodeExecutionCell.propTypes = {
    judge0_token: PropTypes.string.isRequired,
};