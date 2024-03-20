import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Select, SelectItem, Textarea, Button } from "@nextui-org/react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Upload() {
  const [preferredCodeLanguage, setPreferredCodeLanguage] = useState([])
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    "username": '',
    "language_code": '',
    "stdin": '',
    "code": '',
  })

  function handleOnInputsChange(e) {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }));
  }

  const handleFormSubmission = async () => {
    setIsFormSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const codeJudge0SubmissionResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=stdout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': import.meta.env.VITE_RapidAPI_KEY,
          'X-RapidAPI-Host': import.meta.env.VITE_RapidAPI_URL
        },
        body: JSON.stringify({
          language_id: formData.language_code,
          source_code: btoa(formData.code),
          stdin: formData.stdin ? btoa(formData.stdin) : null
        })
      });

      const codeSubmissionData = await codeJudge0SubmissionResponse.json();

      if (codeJudge0SubmissionResponse.ok) {
        const snippetSaveResponse = await fetch(`${API_URL}/api/snippet/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            judge0_token: codeSubmissionData.token,
            language_code: formData.language_code,
            language_name: preferredCodeLanguage.filter((ele) => { return ele.id === parseInt(formData.language_code) })[0].name,
            stdin: formData.stdin,
            source_code: formData.code
          }),
        });

        if (snippetSaveResponse.ok) {
          const snippetData = await snippetSaveResponse.json();
          setSuccessMessage(snippetData.message);
          setFormData({
            "username": '',
            "language_code": '',
            "stdin": '',
            "code": '',
          });

        } else {
          setErrorMessage(snippetSaveResponse.message | 'Oops! Got Error on the way!!');
        }

      }
    } catch (error) {
      console.log(error)
      setErrorMessage(error.message);
    }
    setIsFormSubmitting(false);
  };

  const loadPreferredLanguagesList = async () => {
    const response = await fetch('https://ce.judge0.com/languages/');
    const data = await response.json();
    setPreferredCodeLanguage(data)
  }

  useEffect(() => {
    loadPreferredLanguagesList()
  }, [])

  return (
    <section className="w-full min-h-screen bg-indigo-200 grid place-items-center">
      <Card className="w-[50vw] max-md:w-[98vw] bg-indigo-100" shadow="lg">
        <CardHeader className="flex gap-3">
          <h1 className="text-xl font-semibold">Upload Your Assignment</h1>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={(e) => { e.preventDefault() }} className="flex flex-col gap-4">
            <Input
              fullWidth
              isClearable
              type="text"
              label="Username"
              variant="faded"
              placeholder="Enter your username"
              name="username"
              value={formData.username}
              onChange={handleOnInputsChange}
            />

            <Select
              label="Preferred Code Language"
              placeholder="Select a Language"
              fullWidth
              name="language_code"
              value={formData.code_lang}
              onChange={handleOnInputsChange}
            >
              {preferredCodeLanguage.map((lang) => (
                <SelectItem key={lang.id} value={lang.id} >
                  {lang.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              fullWidth
              isClearable
              type="text"
              label="StdIn"
              variant="faded"
              placeholder="Enter your Standard Input"
              name="stdin"
              value={formData.stdin}
              onChange={handleOnInputsChange}
            />
            
            <Textarea
              fullWidth
              label="Code"
              variant="faded"
              placeholder="Enter your code"
              name="code"
              value={formData.code}
              onChange={handleOnInputsChange}
            />
          </form>
        </CardBody>
        <Divider />
        <CardFooter>
          {errorMessage && <p className='text-sm text-danger-400 font-semibold'>{errorMessage}</p>}
          <br />
          {successMessage && <p className='text-sm text-success-400 font-semibold'>{successMessage}</p>}
        </CardFooter>
        <CardFooter>
          <Button variant="shadow" color="primary" onClick={handleFormSubmission} isLoading={isFormSubmitting}>Submit</Button>
        </CardFooter>
      </Card>
    </section>
  )
}
